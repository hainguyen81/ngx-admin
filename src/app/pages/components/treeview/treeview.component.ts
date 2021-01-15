import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2,
    RendererStyleFlags2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from '@app/types/index';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {DropdownTreeviewComponent, TreeviewComponent, TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import {AbstractTreeviewComponent} from './abstract.treeview.component';
import {IEvent} from '../abstract.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '../../../utils/common/object.utils';
import ComponentUtils from 'app/utils/common/component.utils';
import HtmlUtils from 'app/utils/common/html.utils';
import {throwError} from 'rxjs';

/**
 * Tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export class NgxTreeviewComponent extends AbstractTreeviewComponent<DataSource>
    implements AfterViewInit, AfterContentChecked {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(TreeviewComponent)
    private readonly queryTreeviewComponent: QueryList<TreeviewComponent>;
    private __treeviewComponent: TreeviewComponent;

    @ViewChildren(DropdownTreeviewComponent)
    private readonly queryDropdownTreeviewComponent: QueryList<DropdownTreeviewComponent>;
    private __dropdownTreeviewComponent: DropdownTreeviewComponent;

    /** backup pointer to generate selection function of treeview component */
    private __originalGenerateSelection: () => void;
    private __originalDropdownOpen: () => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {TreeviewComponent} component
     * @return the {TreeviewComponent} component
     */
    protected get treeviewComponent(): TreeviewComponent {
        return this.__treeviewComponent;
    }

    /**
     * Get the {DropdownTreeviewComponent} component
     * @return the {DropdownTreeviewComponent} component
     */
    protected get dropdownTreeviewComponent(): DropdownTreeviewComponent {
        return this.__dropdownTreeviewComponent;
    }

    /**
     * Set the selected {TreeviewItem} array
     * @param items to select
     * @param reset specify whether reset the current selected items
     */
    public setSelectedTreeviewItems(items?: TreeviewItem[] | [], reset?: boolean): void {
        const currentSelection: TreeviewSelection = this.treeviewSelection;
        if (ObjectUtils.isNou(currentSelection)) return;
        // un-check previous items
        (currentSelection.checkedItems || []).forEach(it => this.internalCheck(it, false));
        // collect new item checked
        let builtSelection: { checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[] };
        builtSelection = this.collectSelection(items);
        currentSelection.checkedItems = builtSelection.checkedItems;
        currentSelection.uncheckedItems = builtSelection.uncheckedItems;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxTreeviewComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        const _this: NgxTreeviewComponent = this;

        if (!this.__treeviewComponent) {
            this.__treeviewComponent = ComponentUtils.queryComponent(
                this.queryTreeviewComponent, (component) => {
                    if (component) {
                        // unique hack (cheat) for single item selection
                        _this.__originalGenerateSelection = component['generateSelection'];
                        component['generateSelection'] = () => _this.generateSelection();
                        component.selectedChange.subscribe(
                            value => this.onSelectedChange({data: value}));
                        component.filterChange.subscribe(
                            value => this.onFilterChange({data: value}));
                    }
                });
        }

        if (!this.__dropdownTreeviewComponent) {
            this.__dropdownTreeviewComponent = ComponentUtils.queryComponent(
                this.queryDropdownTreeviewComponent, (component) => {
                    if (component) {
                        // unique hack (cheat) for appending to body
                        _this.__originalDropdownOpen = component.dropdownDirective.open;
                        component.dropdownDirective.open = () => _this.detectDropdownForAppendToBody(component);
                        // unique hack (cheat) for single item selection
                        _this.__originalGenerateSelection = component.treeviewComponent['generateSelection'];
                        component.treeviewComponent['generateSelection'] = () => _this.generateSelection();
                        component.selectedChange.subscribe(
                            value => this.onSelectedChange({data: value}));
                        component.filterChange.subscribe(
                            value => this.onFilterChange({data: value}));
                    }
                });
        }
    }

    ngAfterContentChecked() {
        super.ngAfterContentChecked();

        // re-calculate dropdown position
        if (this.isDropDown() && this.dropdownTreeviewComponent) {
            this.calculateDropdownPosition(this.dropdownTreeviewComponent);
        }
    }

    /**
     * Raise when tree-view item label has been clicked
     * @param $event {MouseEvent}
     * @param item item has been clicked
     * @param onCheckedChange internal checked change listener
     */
    onClickItemLabel($event: MouseEvent,
                     item: TreeviewItem,
                     onCheckedChange: (checked: boolean) => void): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClickItemLabel', $event, item);
        if (item) {
            this.revertCheck(item);
            if (this.isEnabledItemCheck && onCheckedChange) {
                onCheckedChange.apply(this, [item.checked]);
            }
            if (!this.isEnabledItemCheck || !onCheckedChange) {
                // un-check previous items
                (this.treeviewSelection.checkedItems || []).forEach(it => this.internalCheck(it, false));
                // collect new item checked
                let builtSelection: { checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[] };
                builtSelection = this.collectSelection();
                this.treeviewSelection.checkedItems = builtSelection.checkedItems;
                this.treeviewSelection.uncheckedItems = builtSelection.uncheckedItems;
                this.treeviewComponent && this.treeviewComponent.selectedChange.emit([item]);
                this.dropdownTreeviewComponent
                && this.dropdownTreeviewComponent.treeviewComponent
                && this.dropdownTreeviewComponent.treeviewComponent.selectedChange.emit([item]);

                // if not multiple selection; then closing dropdown if necessary
                this.dropdownTreeviewComponent
                && this.dropdownTreeviewComponent.dropdownDirective
                && this.dropdownTreeviewComponent.dropdownDirective.close();
            }
            this.onClickItem.apply(this, [{event: $event, data: item}]);
        }
    }

    /**
     * Raise when tree-view item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {TreeviewItem}
     */
    onClickItem(event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClickItem', event);
        if (event && event.event && event.event.target instanceof Element) {
            const targetEl: Element = event.event.target as Element;
            const itemEl: Element = (targetEl.tagName === AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR ? targetEl
                : this.getClosestElementBySelector(AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, targetEl));
            if (itemEl && !itemEl.classList.contains('selected')) {
                // clear another selected items
                const prevSelectedItemEls: NodeListOf<HTMLElement> = this.getElementsBySelector(
                    [AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
                if (prevSelectedItemEls && prevSelectedItemEls.length) {
                    prevSelectedItemEls.forEach(selItemEl => this.toggleElementClass(selItemEl, 'selected', false));
                }

                // toggle current selected item
                this.toggleElementClass(itemEl as HTMLElement, 'selected', true);

                // if not multiple selection; then closing dropdown if necessary
                if (!this.isEnabledItemCheck) {
                    this.dropdownTreeviewComponent
                    && this.dropdownTreeviewComponent.dropdownDirective
                    && this.dropdownTreeviewComponent.dropdownDirective.close();
                }
            }
        }
    }

    /**
     * Perform action on menu item has been clicked
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      event: action event
     *      item: menu item data
     */
    onMenuEvent(event: IEvent) {
        super.onMenuEvent(event);

    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Map the specified data from data-source to tree-view items to show
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('mappingDataSourceToTreeviewItems', data);
        return undefined;
    }

    /**
     * Detect and ensure dropdown tree while using {appendToBody} configuration
     * @param dropdownTreeviewComponent {DropdownTreeviewComponent}
     */
    private detectDropdownForAppendToBody(dropdownTreeviewComponent: DropdownTreeviewComponent): void {
        if (!this.isDropDown() || ObjectUtils.isNou(dropdownTreeviewComponent)
            || ObjectUtils.isNou(dropdownTreeviewComponent.dropdownDirective)
            || ObjectUtils.isNou(dropdownTreeviewComponent.dropdownDirective.toggleElement)
            || !this.isAppendToBody) {
            dropdownTreeviewComponent && dropdownTreeviewComponent.dropdownDirective
            && this.__originalDropdownOpen.apply(dropdownTreeviewComponent.dropdownDirective);
            return;
        }

        const dropdownMenuEl: Element = (dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] instanceof Element
            ? dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] as Element
            : HtmlUtils.nextSibling(dropdownTreeviewComponent.dropdownDirective.toggleElement, '[ngxDropdownMenu].dropdown-menu'));
        if (ObjectUtils.isNotNou(dropdownMenuEl)) {
            dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] = dropdownMenuEl;
            this.getRenderer().removeClass(dropdownMenuEl, 'ngx-treeview');
            this.getRenderer().addClass(dropdownMenuEl, 'ngx-treeview');
            this.getRenderer().appendChild(document.body, dropdownMenuEl);
            this.calculateDropdownPosition(dropdownTreeviewComponent, dropdownMenuEl);
        }

        this.__originalDropdownOpen.apply(dropdownTreeviewComponent.dropdownDirective);
    }

    /**
     * Override this method of {TreeviewComponent}
     */
    private generateSelection() {
        if (this.isEnabledItemCheck && typeof this.__originalGenerateSelection === 'function') {
            if (this.treeviewComponent) {
                this.__originalGenerateSelection.apply(this.treeviewComponent);
            }
            if (this.dropdownTreeviewComponent && this.dropdownTreeviewComponent.treeviewComponent) {
                this.__originalGenerateSelection.apply(this.dropdownTreeviewComponent.treeviewComponent);
            }

        } else {
            if (this.isDropDown() && this.dropdownTreeviewComponent
                && this.dropdownTreeviewComponent.treeviewComponent) {
                this.dropdownTreeviewComponent.treeviewComponent.selection = this.collectSelection();
            } else if (!this.isDropDown() && this.treeviewComponent) {
                this.treeviewComponent.selection = this.collectSelection();
            } else {
                throwError('Could not initialize tree-view selection while component has not been initialized yet!');
            }
        }
    }

    /**
     * Calculate the offset position of the dropdown tree
     * @param dropdownTreeviewComponent {DropdownTreeviewComponent}
     * @param dropdownMenuEl dropdown menu element
     */
    private calculateDropdownPosition(
        dropdownTreeviewComponent: DropdownTreeviewComponent, dropdownMenuEl?: Element | null) {
        const menuEl: Element = (ObjectUtils.isNotNou(dropdownMenuEl) ? dropdownMenuEl
            : dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] instanceof Element
                ? dropdownTreeviewComponent.dropdownDirective['dropdownMenu'] as Element
                : HtmlUtils.nextSibling(dropdownTreeviewComponent.dropdownDirective.toggleElement, '[ngxDropdownMenu].dropdown-menu'));
        if (ObjectUtils.isNotNou(menuEl) && this.isAppendToBody) {
            const offset: { top: number, left: number, width: number, height: number } =
                super.offset(dropdownTreeviewComponent.dropdownDirective.toggleElement);
            this.getRenderer().setStyle(
                menuEl,
                'top', (offset.top + offset.height + 5) + 'px',
                RendererStyleFlags2.Important);
            this.getRenderer().setStyle(
                menuEl,
                'left', offset.left + 'px',
                RendererStyleFlags2.Important);
            this.getRenderer().setStyle(
                menuEl,
                'width', offset.width + 'px',
                RendererStyleFlags2.Important);
        }
    }
}

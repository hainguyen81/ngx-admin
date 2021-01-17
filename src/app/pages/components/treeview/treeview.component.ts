import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    OnDestroy,
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
import {DropdownDirective, DropdownTreeviewComponent, TreeviewComponent, TreeviewItem, TreeviewSelection, ɵb as DropdownMenuDirective} from 'ngx-treeview';
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
import {Subscription, throwError} from 'rxjs';
import FunctionUtils from 'app/utils/common/function.utils';
import PromiseUtils from 'app/utils/common/promise.utils';
import ArrayUtils from 'app/utils/common/array.utils';

/**
 * Tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export class NgxTreeviewComponent extends AbstractTreeviewComponent<DataSource>
    implements AfterViewInit, AfterContentChecked, OnDestroy {

    protected static PROPERTY_DROPDOWN_MENU_ELEMENT = 'dropdownMenu';
    private static PROPERTY_GENERATE_SELECTION = 'generateSelection';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(TreeviewComponent)
    private readonly queryTreeviewComponent: QueryList<TreeviewComponent>;
    private __treeviewComponent: TreeviewComponent;

    @ViewChildren(DropdownTreeviewComponent)
    private readonly queryDropdownTreeviewComponent: QueryList<DropdownTreeviewComponent>;
    private __dropdownTreeviewComponent: DropdownTreeviewComponent;

    @ViewChildren(DropdownDirective)
    private readonly queryDropdownTreeviewDirectiveComponent: QueryList<DropdownDirective>;
    private __dropdownTreeviewDirectiveComponent: DropdownDirective;

    @ViewChildren(DropdownMenuDirective)
    private readonly queryDropdownTreeviewMenuDirectiveComponent: QueryList<DropdownMenuDirective>;
    private __dropdownTreeviewMenuDirectiveComponent: DropdownMenuDirective;

    /** backup pointer to generate selection function of treeview component */
    private __originalGenerateSelection: () => void;
    private __originalDropdownOpen: () => void;

    private __selectedChangedSubscription: Subscription;
    private __filterChangedSubscription: Subscription;

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
     * Get the {DropdownDirective} component
     * @return the {DropdownDirective} component
     */
    protected get dropdownTreeviewDirectiveComponent(): DropdownDirective {
        return this.__dropdownTreeviewDirectiveComponent;
    }

    /**
     * Get the {DropdownMenuDirective} component
     * @return the {DropdownMenuDirective} component
     */
    protected get dropdownTreeviewMenuDirectiveComponent(): DropdownMenuDirective {
        return this.__dropdownTreeviewMenuDirectiveComponent;
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
        const builtSelection: { checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[] } = this.collectSelection(items);
        currentSelection.checkedItems = builtSelection.checkedItems;
        currentSelection.uncheckedItems = builtSelection.uncheckedItems;
        // TODO rebuild the dropdown button selected value
        FunctionUtils.invoke(
            this.isDropDown() && ObjectUtils.isNotNou(this.dropdownTreeviewComponent)
            && ArrayUtils.isNotEmptyArray(currentSelection.checkedItems),
            () => this.dropdownTreeviewComponent.buttonLabel = this.dropdownTreeviewComponent.i18n.getText(currentSelection),
            undefined, this.dropdownTreeviewComponent);
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
                    // unique hack (cheat) for single item selection
                    _this.__originalGenerateSelection = ObjectUtils.get(component, NgxTreeviewComponent.PROPERTY_GENERATE_SELECTION);
                    ObjectUtils.set(component, NgxTreeviewComponent.PROPERTY_GENERATE_SELECTION, () => _this.generateSelection());
                    FunctionUtils.invoke(
                        ObjectUtils.isNou(this.__selectedChangedSubscription),
                        () => this.__selectedChangedSubscription = component.selectedChange.subscribe(
                            value => this.onSelectedChange({data: value})),
                        undefined, this);
                    FunctionUtils.invoke(
                        ObjectUtils.isNou(this.__filterChangedSubscription),
                        () => this.__filterChangedSubscription = component.filterChange.subscribe(
                            value => this.onFilterChange({data: value})),
                        undefined, this);
                });
        }

        if (!this.__dropdownTreeviewComponent) {
            this.__dropdownTreeviewComponent = ComponentUtils.queryComponent(
                this.queryDropdownTreeviewComponent, (component) => {
                    // unique hack (cheat) for single item selection
                    _this.__originalGenerateSelection = ObjectUtils.get(component.treeviewComponent, NgxTreeviewComponent.PROPERTY_GENERATE_SELECTION);
                    ObjectUtils.set(component.treeviewComponent, NgxTreeviewComponent.PROPERTY_GENERATE_SELECTION, () => _this.generateSelection());
                    FunctionUtils.invoke(
                        ObjectUtils.isNou(this.__selectedChangedSubscription),
                        () => this.__selectedChangedSubscription = component.selectedChange.subscribe(
                            value => this.onSelectedChange({data: value})),
                        undefined, this);
                    FunctionUtils.invoke(
                        ObjectUtils.isNou(this.__filterChangedSubscription),
                        () => this.__filterChangedSubscription = component.filterChange.subscribe(
                            value => this.onFilterChange({data: value})),
                        undefined, this);
                });
        }

        if (!this.__dropdownTreeviewMenuDirectiveComponent) {
            this.__dropdownTreeviewMenuDirectiveComponent = ComponentUtils.queryComponent(this.queryDropdownTreeviewMenuDirectiveComponent);
        }
        if (!this.__dropdownTreeviewDirectiveComponent) {
            this.__dropdownTreeviewDirectiveComponent = ComponentUtils.queryComponent(
                this.queryDropdownTreeviewDirectiveComponent, (component) => {
                    // unique hack (cheat) for appending to body
                    _this.__originalDropdownOpen = component.open;
                    component.open = () => _this.detectDropdownForAppendToBody(
                        this.dropdownTreeviewComponent, component, this.dropdownTreeviewMenuDirectiveComponent);
                });
        }
    }

    ngAfterContentChecked() {
        super.ngAfterContentChecked();

        // re-calculate dropdown position
        if (this.isDropDown() && this.dropdownTreeviewComponent
            && this.dropdownTreeviewDirectiveComponent && this.dropdownTreeviewMenuDirectiveComponent) {
            this.calculateDropdownPosition(this.dropdownTreeviewComponent,
                this.dropdownTreeviewDirectiveComponent, this.dropdownTreeviewMenuDirectiveComponent);
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__selectedChangedSubscription);
        PromiseUtils.unsubscribe(this.__filterChangedSubscription);
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
        // this.getLogger().debug('onClickItemLabel', $event, item);
        if (item) {
            this.revertCheck(item);
            if (this.isEnabledItemCheck && onCheckedChange) {
                onCheckedChange.apply(this, [item.checked]);
            }
            if (!this.isEnabledItemCheck || !onCheckedChange) {
                // un-check previous items
                (this.treeviewSelection.checkedItems || []).forEach(it => this.internalCheck(it, false));
                // collect new item checked
                const builtSelection: { checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[] } = this.collectSelection();
                this.treeviewSelection.checkedItems = builtSelection.checkedItems;
                this.treeviewSelection.uncheckedItems = builtSelection.uncheckedItems;
                this.treeviewComponent && this.treeviewComponent.selectedChange.emit([item]);
                this.dropdownTreeviewComponent
                && this.dropdownTreeviewComponent.treeviewComponent
                && this.dropdownTreeviewComponent.treeviewComponent.selectedChange.emit([item]);

                // if not multiple selection; then closing dropdown if necessary
                this.dropdownTreeviewDirectiveComponent
                && this.dropdownTreeviewDirectiveComponent.close();
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
                    this.dropdownTreeviewDirectiveComponent
                    && this.dropdownTreeviewDirectiveComponent.close();
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
     * Get the drop-down menu element of the specified drop-down treeview
     * @param dropdownTreeviewComponent {DropdownTreeviewComponent}
     * @param dropdownTreeviewDirectiveComponent {DropdownDirective}
     * @param dropdownTreeviewMenuDirectiveComponent {DropdownMenuDirective}
     */
    private detectDropdownTreeviewMenuElement(dropdownTreeviewComponent: DropdownTreeviewComponent,
                                              dropdownTreeviewDirectiveComponent: DropdownDirective,
                                              dropdownTreeviewMenuDirectiveComponent: DropdownMenuDirective): Element {
        return (ObjectUtils.getAs<Element>(dropdownTreeviewDirectiveComponent, NgxTreeviewComponent.PROPERTY_DROPDOWN_MENU_ELEMENT)
            ? ObjectUtils.getAs<Element>(dropdownTreeviewDirectiveComponent, NgxTreeviewComponent.PROPERTY_DROPDOWN_MENU_ELEMENT)
            : ObjectUtils.as<Element>(dropdownTreeviewMenuDirectiveComponent)
                ? ObjectUtils.as<Element>(dropdownTreeviewMenuDirectiveComponent)
                : dropdownTreeviewMenuDirectiveComponent && dropdownTreeviewMenuDirectiveComponent.dropdown
                    ? HtmlUtils.nextSibling(dropdownTreeviewMenuDirectiveComponent.dropdown.toggleElement, '[ngxDropdownMenu].dropdown-menu')
                    : HtmlUtils.nextSibling(dropdownTreeviewDirectiveComponent.toggleElement, '[ngxDropdownMenu].dropdown-menu'));
    }

    /**
     * Detect and ensure dropdown tree while using {appendToBody} configuration
     * @param dropdownTreeviewComponent {DropdownTreeviewComponent}
     * @param dropdownTreeviewDirectiveComponent {DropdownDirective}
     * @param dropdownTreeviewMenuDirectiveComponent {DropdownMenuDirective}
     */
    private detectDropdownForAppendToBody(
        dropdownTreeviewComponent: DropdownTreeviewComponent,
        dropdownTreeviewDirectiveComponent: DropdownDirective,
        dropdownTreeviewMenuDirectiveComponent: DropdownMenuDirective): void {
        const dropdownMenuEl: Element = this.detectDropdownTreeviewMenuElement(
            dropdownTreeviewComponent, dropdownTreeviewDirectiveComponent, dropdownTreeviewMenuDirectiveComponent);
        if (!this.isDropDown() || !this.isAppendToBody || ObjectUtils.isNou(dropdownMenuEl)) {
            FunctionUtils.invoke(ObjectUtils.isNotNou(dropdownTreeviewComponent),
                this.__originalDropdownOpen, undefined, dropdownTreeviewComponent);
            return;
        }

        FunctionUtils.invoke(
            ObjectUtils.isNotNou(dropdownTreeviewDirectiveComponent),
            () => ObjectUtils.set(dropdownTreeviewDirectiveComponent,
                NgxTreeviewComponent.PROPERTY_DROPDOWN_MENU_ELEMENT, dropdownMenuEl),
            undefined, this);
        this.getRenderer().removeClass(dropdownMenuEl, 'ngx-treeview');
        this.getRenderer().addClass(dropdownMenuEl, 'ngx-treeview');
        this.getRenderer().appendChild(document.body, dropdownMenuEl);
        this.calculateDropdownPosition(dropdownTreeviewComponent,
            dropdownTreeviewDirectiveComponent, dropdownTreeviewMenuDirectiveComponent, dropdownMenuEl);

        FunctionUtils.invoke(ObjectUtils.isNotNou(dropdownTreeviewComponent),
            this.__originalDropdownOpen, undefined, dropdownTreeviewComponent);
    }

    /**
     * Override this method of {TreeviewComponent}
     */
    private generateSelection() {
        if (this.isEnabledItemCheck && FunctionUtils.isFunction(this.__originalGenerateSelection)) {
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
     * @param dropdownTreeviewDirectiveComponent {DropdownDirective}
     * @param dropdownTreeviewMenuDirectiveComponent {DropdownMenuDirective}
     * @param dropdownMenuEl dropdown menu element
     */
    private calculateDropdownPosition(
        dropdownTreeviewComponent: DropdownTreeviewComponent,
        dropdownTreeviewDirectiveComponent: DropdownDirective,
        dropdownTreeviewMenuDirectiveComponent: DropdownMenuDirective,
        dropdownMenuEl?: Element | null) {
        const menuEl: Element = this.detectDropdownTreeviewMenuElement(
            dropdownTreeviewComponent, dropdownTreeviewDirectiveComponent, dropdownTreeviewMenuDirectiveComponent);
        if (ObjectUtils.isNotNou(menuEl) && this.isAppendToBody && ObjectUtils.isNotNou(dropdownTreeviewDirectiveComponent)) {
            const offset: { top: number, left: number, width: number, height: number } =
                super.offset(dropdownTreeviewDirectiveComponent.toggleElement);
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

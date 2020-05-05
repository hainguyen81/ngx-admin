import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewItem, TreeviewSelection} from 'ngx-treeview';
import {AbstractTreeviewComponent} from './abstract.treeview.component';
import {IEvent} from '../abstract.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from 'util';

/**
 * Tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export class NgxTreeviewComponent extends AbstractTreeviewComponent<DataSource> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Set the selected {TreeviewItem} array
     * @param items to select
     * @param reset specify whether reset the current selected items
     */
    public setSelectedTreeviewItems(items?: TreeviewItem[] | [], reset?: boolean): void {
        const currentSelection: TreeviewSelection = this.getTreeviewSelection();
        if (isNullOrUndefined(currentSelection)) return;
        // un-check previous items
        (currentSelection.checkedItems || []).forEach(it => this.internalCheck(it, false));
        // collect new item checked
        let selection: { checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[] };
        selection = this.collectSelection(items);
        currentSelection.checkedItems = selection.checkedItems;
        currentSelection.uncheckedItems = selection.uncheckedItems;
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

    /**
     * Raise when tree-view item label has been clicked
     * @param $event {MouseEvent}
     * @param item item has been clicked
     * @param onCheckedChange internal checked change listener
     */
    private onClickItemLabel($event: MouseEvent,
                             item: TreeviewItem,
                             onCheckedChange: (checked: boolean) => void): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClickItemLabel', $event, item);
        if (item) {
            this.revertCheck(item);
            if (this.isEnabledItemCheck() && onCheckedChange) {
                onCheckedChange.apply(this, [item.checked]);
            }
            if (!this.isEnabledItemCheck() || !onCheckedChange) {
                // un-check previous items
                (this.getTreeviewSelection().checkedItems || [])
                    .forEach(it => this.internalCheck(it, false));
                // collect new item checked
                let selection: {checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[]};
                selection = this.collectSelection();
                this.getTreeviewSelection().checkedItems = selection.checkedItems;
                this.getTreeviewSelection().uncheckedItems = selection.uncheckedItems;
                this.getTreeviewComponent() && this.getTreeviewComponent().selectedChange.emit([item]);
                this.getDropdownTreeviewComponent()
                && this.getDropdownTreeviewComponent().treeviewComponent
                && this.getDropdownTreeviewComponent().treeviewComponent.selectedChange.emit([item]);

                // if not multiple selection; then closing dropdown if necessary
                this.getDropdownTreeviewComponent()
                && this.getDropdownTreeviewComponent().dropdownDirective
                && this.getDropdownTreeviewComponent().dropdownDirective.close();
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
            let targetEl: Element;
            targetEl = event.event.target as Element;
            let itemEl: Element;
            itemEl = (targetEl.tagName === AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR ? targetEl
                : this.getClosestElementBySelector(AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, targetEl));
            if (itemEl && !itemEl.classList.contains('selected')) {
                // clear another selected items
                let prevSelectedItemEls: NodeListOf<HTMLElement>;
                prevSelectedItemEls = this.getElementsBySelector(
                    [AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR, '.selected'].join(''));
                if (prevSelectedItemEls && prevSelectedItemEls.length) {
                    prevSelectedItemEls.forEach(selItemEl => this.toggleElementClass(selItemEl, 'selected', false));
                }

                // toggle current selected item
                this.toggleElementClass(itemEl as HTMLElement, 'selected', true);

                // if not multiple selection; then closing dropdown if necessary
                if (!this.isEnabledItemCheck()) {
                    this.getDropdownTreeviewComponent()
                    && this.getDropdownTreeviewComponent().dropdownDirective
                    && this.getDropdownTreeviewComponent().dropdownDirective.close();
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
}

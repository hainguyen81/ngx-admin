import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, Input,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewItem} from 'ngx-treeview';
import {AbstractTreeviewComponent} from './abstract.treeview.component';
import {IEvent} from '../abstract.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';

/**
 * Tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export class NgxTreeviewComponent extends AbstractTreeviewComponent<DataSource> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @Input('enabledItemCheck') private enabledItemCheck?: boolean | false;
    /** backup pointer to generate selection function of treeview component */
    private origianlGenerateSelection: () => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating this component whether uses checkbox for tree-view item
     * @return true for using checkbox; else false
     */
    public isEnabledItemCheck(): boolean {
        return this.enabledItemCheck;
    }

    /**
     * Set a boolean value indicating this component whether uses checkbox for tree-view item
     * @param enabledItemCheck true for using checkbox; else false
     */
    protected setEnabledItemCheck(enabledItemCheck?: boolean | false): void {
        this.enabledItemCheck = enabledItemCheck;
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
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            undefined, false);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // unique hack (cheat) for single item selection
        if (this.getTreeviewComponent()
            && typeof this.getTreeviewComponent()['generateSelection'] === 'function') {
            this.origianlGenerateSelection = this.getTreeviewComponent()['generateSelection'];
            this.getTreeviewComponent()['generateSelection'] = () => this.generateSelection();
        }
        if (this.getDropdownTreeviewComponent() && this.getDropdownTreeviewComponent().treeviewComponent
            && typeof this.getDropdownTreeviewComponent().treeviewComponent['generateSelection'] === 'function') {
            this.origianlGenerateSelection = this.getDropdownTreeviewComponent().treeviewComponent['generateSelection'];
            this.getDropdownTreeviewComponent().treeviewComponent['generateSelection'] = () => this.generateSelection();
        }
    }

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
            item.checked = !item.checked;
            if (this.isEnabledItemCheck() && onCheckedChange) {
                onCheckedChange.apply(this, [item.checked]);
            }
            if (!this.isEnabledItemCheck() || !onCheckedChange) {
                // un-check previous items
                (this.getTreeviewSelection().checkedItems || []).forEach(it => it.checked = false);
                // collect new item checked
                let selection: {checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[]};
                selection = this.collectSelection();
                this.getTreeviewSelection().checkedItems = selection.checkedItems;
                this.getTreeviewSelection().uncheckedItems = selection.uncheckedItems;
                this.getTreeviewComponent() && this.getTreeviewComponent().selectedChange.emit([item]);
                this.getDropdownTreeviewComponent()
                && this.getDropdownTreeviewComponent().treeviewComponent
                && this.getDropdownTreeviewComponent().treeviewComponent.selectedChange.emit([item]);
            }
            this.onClickItem.apply(this, [{$event: $event, $data: item}]);
        }
    }

    /**
     * Raise when tree-view item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {TreeviewItem}
     */
    onClickItem(event: IEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClickItem', event);
        if (event && event.$event && event.$event.target instanceof Element) {
            let targetEl: Element;
            targetEl = event.$event.target as Element;
            let itemEl: Element;
            itemEl = (targetEl.tagName === AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR
                ? targetEl : targetEl.closest(AbstractTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR));
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
        return [];
    }

    /**
     * Override this method of {TreeviewComponent}
     */
    private generateSelection() {
        if (this.isEnabledItemCheck() && typeof this.origianlGenerateSelection === 'function') {
            if (this.getTreeviewComponent()) {
                this.origianlGenerateSelection.apply(this.getTreeviewComponent());
            }
            if (this.getDropdownTreeviewComponent() && this.getDropdownTreeviewComponent().treeviewComponent) {
                this.origianlGenerateSelection.apply(this.getDropdownTreeviewComponent().treeviewComponent);
            }

        } else {
            this.collectSelection();
        }
    }
    private collectSelection(needToCheckedItems?: TreeviewItem[] | null):
        {checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[]} {
        let checkedItems: TreeviewItem[];
        checkedItems = [];
        if ((needToCheckedItems || []).length) {
            needToCheckedItems.forEach(it => it.checked = true);
            checkedItems = checkedItems.concat(needToCheckedItems);
        }
        let uncheckedItems: TreeviewItem[];
        uncheckedItems = [];

        let items: TreeviewItem[];
        items = [].concat(this.getTreeviewItems());
        items.forEach(item => this.checkSelection(item, checkedItems, uncheckedItems));
        return  {
            checkedItems: [].concat(checkedItems),
            uncheckedItems: [].concat(uncheckedItems),
        };
    }
    private checkSelection(item: TreeviewItem, checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[]): void {
        if (item.checked && checkedItems.indexOf(item) < 0) {
            checkedItems.push(item);
        } else if (!item.checked && uncheckedItems.indexOf(item) < 0) {
            uncheckedItems.push(item);
        }
        if ((item.children || []).length) {
            item.children.forEach(child => this.checkSelection(child, checkedItems, uncheckedItems));
        }
    }

    /**
     * Set the selected {TreeviewItem} array
     * @param items to select
     * @param reset specify whether reset the current selected items
     */
    setSelectedTreeviewItems(items?: TreeviewItem[] | [], reset?: boolean): void {
        // super.setSelectedTreeviewItems(items, reset);

        // un-check previous items
        (this.getTreeviewSelection().checkedItems || []).forEach(it => it.checked = false);
        // collect new item checked
        let selection: {checkedItems: TreeviewItem[], uncheckedItems: TreeviewItem[]};
        selection = this.collectSelection(items);
        this.getTreeviewSelection().checkedItems = selection.checkedItems;
        this.getTreeviewSelection().uncheckedItems = selection.uncheckedItems;
    }
}

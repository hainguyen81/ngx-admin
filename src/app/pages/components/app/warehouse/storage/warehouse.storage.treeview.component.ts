import {AppTreeviewComponent} from '../../components/app.treeview.component';
import {
    ChangeDetectorRef, Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import Warehouse, {IWarehouse} from '../../../../../@core/data/warehouse/warehouse';
import {ToastrService} from 'ngx-toastr';
import {TreeItem, TreeviewConfig, TreeviewItem} from 'ngx-treeview';
import {ModalDialogService} from 'ngx-modal-dialog';
import {IContextMenu} from '../../../abstract.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {WarehouseDatasource} from '../../../../../services/implementation/warehouse/warehouse/warehouse.datasource';
import {ConfirmPopup} from 'ngx-material-popup';
import {COMMON} from '../../../../../config/common.config';
import {TranslateService} from '@ngx-translate/core';

export const WarehouseCategoryTreeviewConfig: TreeviewConfig = {
    decoupleChildFromParent: false,
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasDivider: false,
    hasFilter: true,
    maxHeight: -1,
};

export const WarehouseCategoryContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

/**
 * Base tree-view component base on {TreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view-warehouse-storage',
    templateUrl: '../../../treeview/treeview.component.html',
})
export class WarehouseStorageTreeviewComponent
    extends AppTreeviewComponent<IWarehouse, WarehouseDatasource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseStorageTreeviewComponent} class
     * @param dataSource {WarehouseDatasource}
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
    constructor(@Inject(WarehouseDatasource) dataSource: WarehouseDatasource,
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
            WarehouseCategoryTreeviewConfig, WarehouseCategoryContextMenu);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Create new tree-view item node with the specified node data and the parent node
     * @param parent parent tree-view item {TreeviewItem}
     * @param treeItem new tree-view item data {TreeItem}
     * @return new tree-view item
     */
    protected newItem(parent?: TreeviewItem, treeItem?: TreeItem): TreeviewItem {
        let newItem: TreeviewItem;
        newItem = super.newItem(parent, treeItem);
        if (newItem) {
            newItem.text = this.translate('warehouse.storage.new');
            newItem.value = new Warehouse(
                undefined, undefined, undefined, undefined);
        }
        return newItem;
    }
}

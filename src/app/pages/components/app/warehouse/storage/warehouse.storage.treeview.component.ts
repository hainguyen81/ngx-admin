import {AppTreeviewComponent} from '../../components/app.treeview.component';
import {
    ChangeDetectorRef, Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, Injectable,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import Warehouse, {IWarehouse} from '../../../../../@core/data/warehouse/warehouse';
import {ToastrService} from 'ngx-toastr';
import {
    TreeItem,
    TreeviewI18n,
    TreeviewI18nDefault,
    TreeviewItem,
    TreeviewSelection,
} from 'ngx-treeview';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {WarehouseDatasource} from '../../../../../services/implementation/warehouse/warehouse.storage/warehouse.datasource';
import {ConfirmPopup} from 'ngx-material-popup';
import {COMMON} from '../../../../../config/common.config';
import {TranslateService} from '@ngx-translate/core';
import {TOKEN_APP_TREEVIEW_SHOW_ALL} from '../../components/app.treeview.i18n';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxTreeviewConfig} from '../../../treeview/abstract.treeview.component';

export const WarehouseCategoryTreeviewConfig: NgxTreeviewConfig = NgxTreeviewConfig.create({
    decoupleChildFromParent: false,
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    maxHeight: -1,
});

export const WarehouseCategoryContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

/**
 * Multi language for treeview field
 */
@Injectable()
export class WarehouseStorageTreeviewI18n extends TreeviewI18nDefault {

    constructor(@Inject(TranslateService) private translateService: TranslateService,
                @Inject(TOKEN_APP_TREEVIEW_SHOW_ALL) private showAll?: boolean | true) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if ((!selection || !(selection.uncheckedItems || []).length) && this.showAll) {
            return this.getAllCheckboxText();
        }

        switch (((selection || {})['checkedItems'] || []).length) {
            case 0:
                return (this.translateService ? this.translateService.instant(
                    'warehouse.storage.treeview.not_selection') : 'Select archive');
            case 1:
                return (((selection || {})['checkedItems'] || [])[0].text || '').trim();
            default:
                return `${((selection || {})['checkedItems'] || []).length} archives selected`;
        }
    }

    getAllCheckboxText(): string {
        return (this.translateService ? this.translateService.instant(
            'warehouse.storage.treeview.all_selection') : 'All archives');
    }

    getFilterPlaceholder(): string {
        return (this.translateService ? this.translateService.instant(
            'warehouse.storage.treeview.filter') : 'Filter');
    }

    getFilterNoItemsFoundText(): string {
        return (this.translateService ? this.translateService.instant(
            'warehouse.storage.treeview.not_found') : 'No archive found');
    }

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return (this.translateService ? this.translateService.instant(
            isCollapse ? 'warehouse.storage.treeview.expand'
                : 'warehouse.storage.treeview.collapse')
            : isCollapse ? 'Expand' : 'Collapse');
    }
}

/**
 * Base tree-view component base on {TreeviewComponent}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_STORAGE,
    selector: 'ngx-tree-view-app-warehouse-storage',
    templateUrl: '../../../treeview/treeview.component.html',
    styleUrls: [
        '../../../treeview/treeview.component.scss',
        './warehouse.storage.treeview.component.scss',
    ],
    providers: [
        {
            provide: TOKEN_APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: WarehouseStorageTreeviewI18n,
            deps: [TranslateService, TOKEN_APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export class WarehouseStorageTreeviewComponent
    extends AppTreeviewComponent<IWarehouse, WarehouseDatasource> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    isEnabledItemImage(): boolean {
        return true;
    }

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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.config = WarehouseCategoryTreeviewConfig;
        super.setContextMenu(WarehouseCategoryContextMenu);
        super.setItemImageParser(
            item => (item && (<IWarehouse>item.value) ? (<IWarehouse>item.value).image || [] : []));
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

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeItem, TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import WarehouseCategory, {
    IWarehouseCategory,
} from '../../../../../@core/data/warehouse/warehouse.category';
import {AppTreeviewComponent} from '../../components/app.treeview.component';
import WarehouseUtils from '../../../../../utils/warehouse/warehouse.utils';
import {TOKEN_APP_TREEVIEW_SHOW_ALL} from '../../components/app.treeview.i18n';
import {WarehouseCategoryTreeviewI18n} from './warehouse.category.formly.treeview.dropdown.field.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {IContextMenu} from '../../../../../config/context.menu.conf';

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
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_CATEGORY,
    selector: 'ngx-tree-view-app-warehouse-category',
    templateUrl: '../../../treeview/treeview.component.html',
    styleUrls: ['../../../treeview/treeview.component.scss'],
    providers: [
        {
            provide: TOKEN_APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: WarehouseCategoryTreeviewI18n,
            deps: [TranslateService, TOKEN_APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export class WarehouseCategoryTreeviewComponent
    extends AppTreeviewComponent<IWarehouseCategory, WarehouseCategoryDatasource>
    implements AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseCategoryTreeviewComponent} class
     * @param dataSource {WarehouseCategoryDatasource}
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
    constructor(@Inject(WarehouseCategoryDatasource) dataSource: WarehouseCategoryDatasource,
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
            modalDialogService, confirmPopup, lightbox);
        super.setConfig(WarehouseCategoryTreeviewConfig);
        super.setContextMenu(WarehouseCategoryContextMenu);
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
            newItem.text = this.translate('warehouse.category.new');
            newItem.value = new WarehouseCategory(undefined, undefined, undefined);
        }
        return newItem;
    }

    /**
     * Mapping warehouse categories data to warehouse categories tree item
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        return WarehouseUtils.buildWarehouseCategories(data as IWarehouseCategory[]);
    }
}

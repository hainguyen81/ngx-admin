import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {
    WarehouseItemDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {ImageCellComponent} from '../../../smart-table/image.cell.component';
import {Lightbox} from 'ngx-lightbox';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {AppSmartTableComponent} from '../../components/app.table.component';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {NumberCellComponent} from '../../../smart-table/number.cell.component';
import {BarcodeCellComponent} from '../../../smart-table/barcode.cell.component';
import {IEvent} from '../../../abstract.component';
import WarehouseItem, {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {throwError} from 'rxjs';
import {WarehouseItemVersionSplitPaneComponent} from './warehouse.item.version.splitpane.component';

/* warehouse item version table settings */
export const WarehouseItemVersionTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.item.table.noData',
    actions: {
        add: false,
        edit: false,
        delete: false,
    },
    pager: {
        display: true,
        perPage: AppConfig.COMMON.itemsPerPage,
    },
    columns: {
        code: {
            title: 'warehouse.item.table.code',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        name: {
            title: 'warehouse.item.table.name',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        image: {
            title: 'warehouse.item.table.image',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: ImageCellComponent,
        },
        barcode: {
            title: 'warehouse.item.table.barcode',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: BarcodeCellComponent,
        },
        available_stock: {
            title: 'warehouse.item.table.available_stock',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
        },
    },
};

export const WarehouseItemVersionContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-smart-table-app-warehouse-item-version',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseItemVersionSmartTableComponent
    extends AppSmartTableComponent<WarehouseItemDatasource>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected isShowHeader(): boolean {
        return false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemSmartTableComponent} class
     * @param dataSource {WarehouseItemDatasource}
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
    constructor(@Inject(WarehouseItemDatasource) dataSource: WarehouseItemDatasource,
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
        super.setTableHeader('warehouse.item.title');
        super.setTableSettings(WarehouseItemVersionTableSettings);
        super.setContextMenu(WarehouseItemVersionContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
        ], false);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.setNewItemListener(this.onNewVersion);
        this.setEditItemListener(this.onEditVersion);
        this.setDeleteItemListener(this.onDeleteVersion);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    private onNewVersion($event: IEvent) {
        this.openModalDialog(new WarehouseItem(null, null, null));
    }

    private onEditVersion($event: IEvent) {
        const dataModel: IWarehouseItem = ($event && $event.data && $event.data['row'] instanceof Row
            ? ($event.data['row'] as Row).getData() as IWarehouseItem : undefined);
        this.openModalDialog(dataModel);
    }

    private onDeleteVersion($event: IEvent) {
        const dataModel: IWarehouseItem = ($event && $event.data && $event.data['row'] instanceof Row
            ? ($event.data['row'] as Row).getData() as IWarehouseItem : undefined);
        dataModel || throwError('Could not found the edited data model!');
    }

    private openModalDialog(dataModel: IWarehouseItem) {
        dataModel || throwError('Could not found the dialog data model!');
        dataModel && this.getModalDialogService().openDialog(
            super.getRootViewContainerRef(), {
            title: this.translate(this.tableHeader),
            childComponent: WarehouseItemVersionSplitPaneComponent,
            data: dataModel,
            actionButtons: [
                { text: this.translate('common.form.action.save') },
                { text: this.translate('common.form.action.reset') },
                { text: this.translate('common.form.action.close'), onAction: () => true },
            ],
        });
    }
}
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnDestroy, OnInit,
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
import {of, Subject, throwError} from 'rxjs';
import {WarehouseItemVersionSplitPaneComponent} from './warehouse.item.version.splitpane.component';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {Cell, DefaultEditor, LocalDataSource} from 'ng2-smart-table';
import {
    WarehouseItemVersionDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.item.version/warehouse.item.version.datasource';
import {IdGenerators} from '../../../../../config/generator.config';
import PromiseUtils from '../../../../../utils/promise.utils';

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
        image: {
            title: 'warehouse.item.table.code',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: ImageCellComponent,
            editor: {
                type: 'custom',
                component: ImageCellComponent,
                config: {
                    'descriptorPrepare': (c: DefaultEditor,
                                          cell: Cell, row: Row,
                                          data: IWarehouseItem,
                                          config: any) => {
                        return (data ? data.code || '' : '');
                    },
                },
            },
        },
        name: {
            title: 'warehouse.item.table.name',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        barcode: {
            title: 'warehouse.item.table.barcode',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: BarcodeCellComponent,
        },
        cost_price: {
            title: 'warehouse.item.table.cost_price',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: true,
            },
        },
        selling_price: {
            title: 'warehouse.item.table.selling_price',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: true,
            },
        },
        dealer_price: {
            title: 'warehouse.item.table.dealer_price',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: NumberCellComponent,
            config: {
                isCurrency: true,
            },
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
    styleUrls: [
        '../../../smart-table/smart-table.component.scss',
        './warehouse.item.version.splitpane.component.scss',
    ],
})
export class WarehouseItemVersionSmartTableComponent
    extends AppSmartTableComponent<LocalDataSource>
    implements OnInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private dataModel?: IWarehouseItem | null;
    private dataModelVersion?: IWarehouseItem[] = [];
    private saveSubject: Subject<IWarehouseItem> = new Subject<IWarehouseItem>();

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get isShowHeader(): boolean {
        return false;
    }

    public getDataModel(): IWarehouseItem {
        return this.dataModel;
    }

    public setDataModel(dataModel?: WarehouseItem | null) {
        this.dataModel = dataModel;
        this.loadVersions(this.dataModel);
    }

    public getVersions(): IWarehouseItem[] {
        return this.dataModelVersion;
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
     * @param warehouseItemVersionDatasource {WarehouseItemVersionDatasource}
     */
    constructor(@Inject(DataSource) dataSource: LocalDataSource,
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(WarehouseItemVersionDatasource)
                private warehouseItemVersionDatasource?: WarehouseItemVersionDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        warehouseItemVersionDatasource
        || throwError('Could not inject WarehouseItemVersionDatasource instance');
        this.tableHeader = 'warehouse.item.title';
        this.config = WarehouseItemVersionTableSettings;
        this.setContextMenu(WarehouseItemVersionContextMenu);
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

        const _this: WarehouseItemVersionSmartTableComponent = this;
        this.saveSubject.subscribe(value => {
            const version: IWarehouseItem = value;
            if (!(version.id || '').length) {
                version.id = IdGenerators.oid.generate();
                version.item_id = _this.getDataModel().id;
                version.item_code = _this.getDataModel().code;
                version.is_version = 1;
                _this.dataModelVersion.unshift(version);
            }
            _this.getDataSource().refresh();
        });
    }

    ngOnDestroy(): void {
        PromiseUtils.unsubscribe(this.saveSubject);
        super.ngOnDestroy();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    private loadVersions(model?: IWarehouseItem | null) {
        this.warehouseItemVersionDatasource.setDataModel(model);
        this.warehouseItemVersionDatasource.onChanged().subscribe(value => {
            this.dataModelVersion = (value ? value['elements'] || [] : []);
            of(this.dataModelVersion).subscribe(nextValue => {
                this.getDataSource().load(nextValue).then(
                    versions => this.getLogger().debug('Loading item versions successful'),
                    reason => this.getLogger().error(reason))
                    .catch(reason => this.getLogger().error(reason));
            });
        });
    }

    private onNewVersion($event: IEvent) {
        const newVersion: IWarehouseItem = new WarehouseItem(null, null, null);
        this.openModalDialog(newVersion);
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
            data: { model: dataModel, subject: this.saveSubject },
            actionButtons: [
                {
                    text: this.translate('common.form.action.save'),
                    buttonClass: ['btn-save',
                        'appearance-filled size-small status-primary shape-rectangle transitions'].join(' '),
                },
                {
                    text: this.translate('common.form.action.reset'),
                    buttonClass: ['btn-reset',
                        'appearance-filled size-small status-warning shape-rectangle transitions'].join(' '),
                },
                {
                    text: this.translate('common.form.action.close'),
                    buttonClass: ['btn-close',
                        'appearance-filled size-small shape-rectangle transitions'].join(' '),
                    onAction: () => true,
                },
            ],
            settings: {
                modalClass: 'modal ngx-modal version-modal',
                closeButtonTitle: this.translate('common.form.action.close'),
                modalDialogClass: 'modal-dialog version-dialog',
                bodyClass: 'modal-body scrollable',
            },
        });
    }
}

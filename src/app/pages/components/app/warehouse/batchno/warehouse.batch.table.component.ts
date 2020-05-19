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
import {Lightbox} from 'ngx-lightbox';
import {AppSmartTableComponent} from '../../components/app.table.component';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import PromiseUtils from '../../../../../utils/promise.utils';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectTranslateCellComponent} from '../../../smart-table/select.translate.cell.component';
import {Cell, DefaultEditor} from 'ng2-smart-table';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {IWarehouseBatchNo} from '../../../../../@core/data/warehouse/warehouse.batch.no';
import {
    WarehouseBatchNoDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.datasource';
import {HtmlCellComponent} from '../../../smart-table/html.cell.component';
import moment, {Moment} from 'moment';
import {isNullOrUndefined} from 'util';

/* warehouse batch no table settings */
export const WarehouseBatchNoTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.batch_no.table.noData',
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
        overdue: {
            title: 'warehouse.batch_no.table.code',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: HtmlCellComponent,
            editor: {
                type: 'custom',
                component: HtmlCellComponent,
                config: {
                    format: 'common.date.dd/mm/yyyy',
                    'htmlValuePrepare': (c: DefaultEditor,
                                         cell: Cell, row: Row,
                                         batch: IWarehouseBatchNo,
                                         config: any) => {
                        const cellCtrl: HtmlCellComponent = c as HtmlCellComponent;
                        const expDateValue: string = batch.exp_date;
                        let format: string = (config || {})['format'] || '';
                        format = (cellCtrl && format.length ? cellCtrl.translate(format) || '' : '');
                        // none expired
                        if (isNullOrUndefined(cellCtrl) || !(expDateValue || '').length || !format.length) {
                            return batch.code;
                        }

                        // overdue/expired/near expired
                        const expDate: Moment = moment(expDateValue, format);
                        const curDate: number = (new Date()).getTime();
                        const oneDate: number = (1000 * 60 * 60 * 24);
                        const threeDate: number = 3 * oneDate;
                        // diff in milliseconds
                        const diff: number = (Math.round(((expDate.unix() * 1000) - curDate) / oneDate) * oneDate);

                        // near expired
                        let icon = '';
                        if (0 <= diff && diff <= oneDate) {
                            icon = 'fas fa-exclamation-triangle status-expired';

                        } else if (oneDate < diff && diff <= threeDate) {
                            icon = 'fas fa-exclamation-triangle status-near-expired';

                        } else if (diff < 0) {
                            icon = 'fas fa-exclamation-triangle status-overdue';

                        }
                        return ['<i class=\'', icon, '\'></i>', batch.code].join('');
                    },
                },
            },
        },
        name: {
            title: 'warehouse.batch_no.table.name',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        mfg_date: {
            title: 'warehouse.batch_no.table.mfg_date',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        exp_date: {
            title: 'warehouse.batch_no.table.exp_date',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        status: {
            title: 'warehouse.batch_no.table.status',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: SelectTranslateCellComponent,
            editor: {
                type: 'custom',
                component: SelectTranslateCellComponent,
                config: {list: []},
            },
        },
        remark: {
            title: 'warehouse.batch_no.table.remark',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
    },
};

export const WarehouseBatchNoContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_BATCH,
    selector: 'ngx-smart-table-app-warehouse-batch-no',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseBatchNoSmartTableComponent
    extends AppSmartTableComponent<WarehouseBatchNoDatasource>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get isShowHeader(): boolean {
        return false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseBatchNoSmartTableComponent} class
     * @param dataSource {WarehouseBatchNoDatasource}
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
     * @param generalSettingsDatasource {GeneralSettingsDatasource}
     */
    constructor(@Inject(WarehouseBatchNoDatasource) dataSource: WarehouseBatchNoDatasource,
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
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        generalSettingsDatasource || throwError('Could not inject GeneralSettingsDatasource instance');
        this.tableHeader = 'warehouse.settings.title';
        this.config = WarehouseBatchNoTableSettings;
        this.setContextMenu(WarehouseBatchNoContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
            {field: 'mfg_date', search: keyword},
            {field: 'exp_date', search: keyword},
            {field: 'remark', search: keyword},
        ], false);
    }

    ngOnInit(): void {
        super.ngOnInit();

        const settings: any = this.config;
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultSystemGeneralSettingsTableColumn(
                this.generalSettingsDatasource, settings, 'status',
                BUILTIN_CODES.STATUS.code,
                null),
        ]).then(
            value => {
                this.getLogger().debug('Loading general settings successful');
                this.getDataSource().refresh();
            },
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}

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
import {
    WarehouseSettingsDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {AppSmartTableComponent} from '../../components/app.table.component';
import {ImageCellComponent} from '../../../smart-table/image.cell.component';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import AppObserveUtils from '../../../../../utils/app/app.observe.utils';
import PromiseUtils from '../../../../../utils/common/promise.utils';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectTranslateCellComponent} from '../../../smart-table/select.translate.cell.component';
import {Cell, DefaultEditor} from 'ng2-smart-table';
import {Row} from 'ng2-smart-table/lib/lib/data-set/row';
import {IWarehouseSetting} from '../../../../../@core/data/warehouse/warehouse.setting';

/* warehouse settings table settings */
export const WarehouseSettingsTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.settings.table.noData',
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
        type: {
            title: 'warehouse.settings.table.type',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: SelectTranslateCellComponent,
        },
        image: {
            title: 'warehouse.settings.table.code',
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
                                          data: IWarehouseSetting,
                                          config: any) => {
                        return (data ? data.code || '' : '');
                    },
                },
            },
        },
        name: {
            title: 'warehouse.settings.table.name',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        order: {
            title: 'warehouse.settings.table.order',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        remark: {
            title: 'warehouse.settings.table.remark',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
    },
};

export const WarehouseSettingsContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS_GENERAL,
    selector: 'ngx-smart-table-app-warehouse-settings',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class WarehouseSettingsSmartTableComponent
    extends AppSmartTableComponent<WarehouseSettingsDatasource>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get isShowHeader(): boolean {
        return false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseSettingsSmartTableComponent} class
     * @param dataSource {WarehouseSettingsDatasource}
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
    constructor(@Inject(WarehouseSettingsDatasource) dataSource: WarehouseSettingsDatasource,
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
        this.config = WarehouseSettingsTableSettings;
        this.setContextMenu(WarehouseSettingsContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
            {field: 'type', search: keyword},
            {field: 'order', search: keyword},
            {field: 'remark', search: keyword},
        ], false);
    }

    ngOnInit(): void {
        super.ngOnInit();

        const settings: any = this.config;
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultWarehouseGeneralSettingsTableColumn(
                this.generalSettingsDatasource, settings, 'type',
                CommonConstants.COMMON.BUILTIN_CODES.WAREHOUSE_SETTINGS_TYPE.code, null),
        ]).then(
            value => {
                this.getLogger().debug('Loading general settings successful');
                this.getDataSource().refresh();
            },
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}

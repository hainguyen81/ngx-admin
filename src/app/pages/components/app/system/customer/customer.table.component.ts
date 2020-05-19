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
import {CustomerDatasource} from '../../../../../services/implementation/system/customer/customer.datasource';
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
import PromiseUtils from '../../../../../utils/promise.utils';
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {
    SelectTranslateCellComponent,
} from '../../../smart-table/select.translate.cell.component';
import {ImageCellComponent} from '../../../smart-table/image.cell.component';
import {Cell, DefaultEditor} from 'ng2-smart-table';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {ICustomer} from '../../../../../@core/data/system/customer';

/* customers table settings */
export const CustomerTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'system.customer.table.noData',
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
            title: 'system.customer.table.type',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: SelectTranslateCellComponent,
        },
        image: {
            title: 'system.customer.table.code',
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
                                          data: ICustomer,
                                          config: any) => {
                        return (data ? data.code || '' : '');
                    },
                },
            },
        },
        name: {
            title: 'system.customer.table.name',
            type: 'string',
            sort: false,
            filter: false,
        },
        level: {
            title: 'system.customer.table.level',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: SelectTranslateCellComponent,
        },
        email: {
            title: 'system.customer.table.email',
            type: 'string',
            sort: false,
            filter: false,
        },
        tel: {
            title: 'system.customer.table.tel',
            type: 'string',
            sort: false,
            filter: false,
        },
        address: {
            title: 'system.customer.table.address',
            type: 'string',
            sort: false,
            filter: false,
        },
        status: {
            title: 'system.customer.table.status',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: SelectTranslateCellComponent,
        },
    },
};

export const CustomerContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.SYSTEM_CUSTOMER,
    selector: 'ngx-smart-table-app-system-customer',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class CustomerSmartTableComponent
    extends AppSmartTableComponent<CustomerDatasource>
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
     * Create a new instance of {CustomerSmartTableComponent} class
     * @param dataSource {CustomerDatasource}
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
    constructor(@Inject(CustomerDatasource) dataSource: CustomerDatasource,
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
        this.tableHeader = 'system.customer.title';
        this.config = CustomerTableSettings;
        this.setContextMenu(CustomerContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'type', search: keyword},
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
            {field: 'level', search: keyword},
            {field: 'email', search: keyword},
            {field: 'tel', search: keyword},
            {field: 'fax', search: keyword},
            {field: 'address', search: keyword},
        ], false);
    }

    ngOnInit(): void {
        super.ngOnInit();

        const settings: any = this.config;
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultSystemGeneralSettingsTableColumn(
                this.generalSettingsDatasource, settings, 'status',
                BUILTIN_CODES.STATUS.code, null),
            AppObserveUtils.observeDefaultSystemGeneralSettingsTableColumn(
                this.generalSettingsDatasource, settings, 'level',
                BUILTIN_CODES.CUSTOMER_LEVEL.code, null),
            AppObserveUtils.observeDefaultSystemGeneralSettingsTableColumn(
                this.generalSettingsDatasource, settings, 'type',
                BUILTIN_CODES.CUSTOMER_TYPE.code, null),
        ]).then(
            value => {
                this.getLogger().debug('Loading settings successful');
                this.getDataSource().refresh();
            },
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}

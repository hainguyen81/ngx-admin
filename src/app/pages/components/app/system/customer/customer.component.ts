import {
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
import {BaseSmartTableComponent} from '../../../smart-table/base.smart-table.component';
import {CustomerDatasource} from '../../../../../services/implementation/system/customer/customer.datasource';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {IContextMenu} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {Constants} from '../../../../../@core/data/constants/customer.constants';
import convertCustomerStatusToDisplay = Constants.CustomerConstants.convertCustomerStatusToDisplay;
import CUSTOMER_STATUS = Constants.CustomerConstants.CUSTOMER_STATUS;
import CUSTOMER_LEVEL = Constants.CustomerConstants.CUSTOMER_LEVEL;
import convertCustomerLevelToDisplay = Constants.CustomerConstants.convertCustomerLevelToDisplay;
import {MODULE_CODES} from '../../../../../config/api.config';

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
        code: {
            title: 'system.customer.table.code',
            type: 'string',
            sort: false,
            filter: false,
        },
        name: {
            title: 'system.customer.table.name',
            type: 'string',
            sort: false,
            filter: false,
        },
        level: {
            title: 'system.customer.table.level',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
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
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
    },
};

export const CustomerContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.SYSTEM.CUSTOMER,
    selector: 'ngx-smart-table-customers',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class CustomerSmartTableComponent extends BaseSmartTableComponent<CustomerDatasource> {

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
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        super.setTableHeader('system.customer.title');
        super.setTableSettings(CustomerTableSettings);
        super.setContextMenu(CustomerContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
            {field: 'email', search: keyword},
            {field: 'title', search: keyword},
            {field: 'tel', search: keyword},
            {field: 'address', search: keyword},
        ], false);
        this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Convert {CUSTOMER_STATUS} to the showed translated value
     * @param value to convert
     * @return converted value
     */
    private convertCustomerStatusToDisplay(value: CUSTOMER_STATUS): string {
        return this.translate(convertCustomerStatusToDisplay(value));
    }

    /**
     * Convert {CUSTOMER_LEVEL} to the showed translated value
     * @param value to convert
     * @return converted value
     */
    private convertCustomerLevelToDisplay(value: CUSTOMER_LEVEL): string {
        return this.translate(convertCustomerLevelToDisplay(value));
    }

    /**
     * Translate table settings
     */
    protected translateSettings(): void {
        super.translateSettings();

        this.translatedSettings['columns']['status']['valuePrepareFunction'] =
            value => this.convertCustomerStatusToDisplay(value);
        this.translatedSettings['columns']['status']['editor']['config']['list'] = [
            {
                value: CUSTOMER_STATUS.NOT_ACTIVATED,
                title: this.convertCustomerStatusToDisplay(CUSTOMER_STATUS.NOT_ACTIVATED),
            },
            {
                value: CUSTOMER_STATUS.ACTIVATED,
                title: this.convertCustomerStatusToDisplay(CUSTOMER_STATUS.ACTIVATED),
            },
            {
                value: CUSTOMER_STATUS.LOCKED,
                title: this.convertCustomerStatusToDisplay(CUSTOMER_STATUS.LOCKED),
            },
        ];
        this.translatedSettings['columns']['level']['valuePrepareFunction'] =
            value => this.convertCustomerStatusToDisplay(value);
        this.translatedSettings['columns']['level']['editor']['config']['list'] = [
            {
                value: CUSTOMER_LEVEL.NEW,
                title: this.convertCustomerLevelToDisplay(CUSTOMER_LEVEL.NEW),
            },
            {
                value: CUSTOMER_LEVEL.BRONZE,
                title: this.convertCustomerLevelToDisplay(CUSTOMER_LEVEL.BRONZE),
            },
            {
                value: CUSTOMER_LEVEL.SILVER,
                title: this.convertCustomerLevelToDisplay(CUSTOMER_LEVEL.SILVER),
            },
            {
                value: CUSTOMER_LEVEL.GOLD,
                title: this.convertCustomerLevelToDisplay(CUSTOMER_LEVEL.GOLD),
            },
            {
                value: CUSTOMER_LEVEL.PLATINUM,
                title: this.convertCustomerLevelToDisplay(CUSTOMER_LEVEL.PLATINUM),
            },
        ];
    }
}

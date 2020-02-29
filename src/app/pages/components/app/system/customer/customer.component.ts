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
import {CustomerDatasource} from '../../../../../services/implementation/customer/customer.datasource';
import {convertCustomerStatusToDisplay, CUSTOMER_STATUS} from '../../../../../@core/data/customer';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {IContextMenu} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';

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
        customerName: {
            title: 'system.customer.table.customerName',
            type: 'string',
            sort: false,
            filter: false,
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
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup,
            'system.customer.title', CustomerTableSettings, CustomerContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'customerName', search: keyword},
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
    }
}

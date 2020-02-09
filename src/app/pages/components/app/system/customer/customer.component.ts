import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
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
import {ToasterService} from 'angular2-toaster';

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
            valuePrepareFunction: convertCustomerStatusToDisplay,
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {
                    list: [
                        {
                            value: CUSTOMER_STATUS.NOT_ACTIVATED,
                            title: convertCustomerStatusToDisplay(CUSTOMER_STATUS.NOT_ACTIVATED),
                        },
                        {
                            value: CUSTOMER_STATUS.ACTIVATED,
                            title: convertCustomerStatusToDisplay(CUSTOMER_STATUS.ACTIVATED),
                        },
                        {
                            value: CUSTOMER_STATUS.LOCKED,
                            title: convertCustomerStatusToDisplay(CUSTOMER_STATUS.LOCKED),
                        },
                    ],
                },
            },
        },
        enterprise: {
            title: 'system.customer.table.enterprise',
            type: 'boolean',
            sort: false,
            filter: false,
            editable: false,
            editor: {
                type: 'checkbox',
            },
        },
    },
};

export const CustomerContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    selector: 'ngx-smart-table',
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
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     */
    constructor(@Inject(CustomerDatasource) dataSource: CustomerDatasource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToasterService) toasterService: ToasterService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
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
}

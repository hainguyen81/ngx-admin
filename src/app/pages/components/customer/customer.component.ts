import {IContextMenu} from '../smart-table.component';
import {Component, Inject, Renderer2} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {
    BaseSmartTableComponent,
    CONTEXT_MENU_ADD,
    CONTEXT_MENU_DELETE,
    CONTEXT_MENU_EDIT,
} from '../base.smart-table.component';
import {CustomerDatasource} from '../../../services/implementation/customer/customer.datasource';
import {convertCustomerStatusToDisplay, CUSTOMER_STATUS} from '../../../@core/data/customer';

export const CustomerTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'Not found any customers',
    actions: {
        add: false,
        edit: false,
        delete: false,
    },
    columns: {
        customerName: {
            title: 'Customer Name',
            type: 'string',
            sort: false,
            filter: false,
        },
        email: {
            title: 'Email',
            type: 'string',
            sort: false,
            filter: false,
        },
        tel: {
            title: 'Tel',
            type: 'string',
            sort: false,
            filter: false,
        },
        address: {
            title: 'Address',
            type: 'string',
            sort: false,
            filter: false,
        },
        status: {
            title: 'Status',
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
            title: 'Enterprise',
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

export const CustomerContextMenu: IContextMenu[] = [{
    id: (item?: any) => CONTEXT_MENU_ADD,
    icon: (item?: any) => 'plus-square',
    title: (item?: any) => 'Add',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}, {
    id: (item?: any) => CONTEXT_MENU_EDIT,
    icon: (item?: any) => 'edit',
    title: (item?: any) => 'Edit',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}, {
    id: (item?: any) => CONTEXT_MENU_DELETE,
    icon: (item?: any) => 'minus-square',
    title: (item?: any) => 'Delete',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}];

@Component({
    selector: 'ngx-smart-table',
    templateUrl: '../smart-table.component.html',
    styleUrls: ['../smart-table.component.scss'],
})
export class CustomerSmartTableComponent extends BaseSmartTableComponent<CustomerDatasource> {

    constructor(@Inject(CustomerDatasource) dataSource: CustomerDatasource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                renderer: Renderer2) {
        super(dataSource, contextMenuService, logger, renderer,
            'Customers Management', CustomerTableSettings, CustomerContextMenu);
    }
}

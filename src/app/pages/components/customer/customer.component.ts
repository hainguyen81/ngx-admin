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
import {TranslateService} from '@ngx-translate/core';

export const CustomerTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'system.customer.table.noData',
    actions: {
        add: false,
        edit: false,
        delete: false,
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

export const CustomerContextMenu: IContextMenu[] = [{
    id: (item?: any) => CONTEXT_MENU_ADD,
    icon: (item?: any) => 'plus-square',
    title: (item?: any) => 'common.contextMenu.add',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}, {
    id: (item?: any) => CONTEXT_MENU_EDIT,
    icon: (item?: any) => 'edit',
    title: (item?: any) => 'common.contextMenu.edit',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}, {
    id: (item?: any) => CONTEXT_MENU_DELETE,
    icon: (item?: any) => 'minus-square',
    title: (item?: any) => 'common.contextMenu.delete',
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
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService) {
        super(dataSource, contextMenuService, logger, renderer, translateService,
            'system.customer.title', CustomerTableSettings, CustomerContextMenu);
    }
}

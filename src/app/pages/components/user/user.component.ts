import {IContextMenu, SmartTableComponent} from '../smart-table.component';
import {Component, Inject} from '@angular/core';
import {convertUserStatusToDisplay, USER_STATUS} from '../../../@core/data/user';
import {UserDataSource} from '../../../services/implementation/user/user.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';

export const UserTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'Not found any users',
    actions: {
        add: false,
        edit: false,
        delete: false,
    },
    columns: {
        username: {
            title: 'User Name',
            type: 'string',
            sort: false,
            filter: false,
            editable: true,
        },
        firstName: {
            title: 'First Name',
            type: 'string',
            sort: false,
            filter: false,
        },
        lastName: {
            title: 'Last Name',
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
        status: {
            title: 'Status',
            type: 'string',
            valuePrepareFunction: convertUserStatusToDisplay,
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {
                    list: [
                        {
                            value: USER_STATUS.NOT_ACTIVATED,
                            title: convertUserStatusToDisplay(USER_STATUS.NOT_ACTIVATED),
                        },
                        {
                            value: USER_STATUS.ACTIVATED,
                            title: convertUserStatusToDisplay(USER_STATUS.ACTIVATED),
                        },
                        {
                            value: USER_STATUS.LOCKED,
                            title: convertUserStatusToDisplay(USER_STATUS.LOCKED),
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

export const UserContextMenu: IContextMenu[] = [{
    icon: (item?: any) => 'plus-square',
    title: (item?: any) => 'Add',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
    click: (item?: any) => {
        alert('111');
    },
}, {
    icon: (item?: any) => 'edit',
    title: (item?: any) => 'Edit',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
    click: (item?: any) => {
    },
}, {
    icon: (item?: any) => 'minus-square',
    title: (item?: any) => 'Delete',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
    click: (item?: any) => {
        alert('222');
    },
}];

@Component({
    selector: 'ngx-smart-table',
    templateUrl: '../smart-table.component.html',
    styleUrls: ['../smart-table.component.scss'],
})
export class UserSmartTableComponent extends SmartTableComponent {

    constructor(@Inject(UserDataSource) userDataSource: UserDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(userDataSource, contextMenuService, logger);
        super.setTableHeader('Users Management');
        super.setTableSettings(UserTableSettings);
        super.setContextMenu(UserContextMenu);
    }

    onDoubleClick(event): void {
        super.editRowByData(event.data, 'id');
    }

    onKeyDown(event: KeyboardEvent) {
        super.onKeyDown(event);

        if (!super.getRows().length) {
            return;
        }

        // enter edit mode by F2
        if (super.isSpecifiedKey(event, 'F2', 113)) {
            if (super.getSelectedRows().length) {
                super.editRow(super.getSelectedRows().shift());
            } else {
                super.editRow(super.getRows().shift());
            }

            // exit editing mode by Esc
        } else if (super.isSpecifiedKey(event, 'Escape', 'Esc', 27)) {
            if (super.getSelectedRows().length) {
                super.cancelEditRows(super.getSelectedRows());
            } else {
                super.cancelEditAll();
            }
        }
    }
}

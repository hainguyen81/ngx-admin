import {SmartTableComponent} from '../smart-table.component';
import {Component, Inject} from '@angular/core';
import {USER_STATUS} from '../../../@core/data/user';
import {UserDataSource} from '../../../services/implementation/user/user.datasource';

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
            type: 'number',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {
                    list: [
                        {value: USER_STATUS.NOT_ACTIVATED, title: 'Not activated'},
                        {value: USER_STATUS.ACTIVATED, title: 'Activated'},
                        {value: USER_STATUS.LOCKED, title: 'Locked'},
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
        },
    },
};

@Component({
    selector: 'ngx-smart-table',
    templateUrl: '../smart-table.component.html',
    styleUrls: ['../smart-table.component.scss'],
})
export class UserSmartTableComponent extends SmartTableComponent {

    constructor(@Inject(UserDataSource) private userDataSource: UserDataSource) {
        super();
        super.setTableHeader('Users Management');
        super.setTableSettings(UserTableSettings);
        super.setDataSource(userDataSource);
    }
}

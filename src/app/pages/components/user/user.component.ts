import {SmartTableComponent} from '../smart-table.component';
import {Component, Inject} from '@angular/core';
import {UserDbService, UserHttpService} from '../../../services/implementation/user/user.service';

export const UserTableSettings = {
    columns: {
        username: {
            title: 'User Name',
            type: 'string',
        },
        firstName: {
            title: 'First Name',
            type: 'string',
        },
        lastName: {
            title: 'Last Name',
            type: 'string',
        },
        email: {
            title: 'Email',
            type: 'string',
        },
        status: {
            title: 'Status',
            type: 'string',
        },
        enterprise: {
            title: 'Enterprise',
            type: 'boolean',
        },
    },
};

@Component({
    selector: 'ngx-smart-table',
    templateUrl: '../smart-table.component.html',
    styleUrls: ['../smart-table.component.scss'],
})
export class UserSmartTableComponent extends SmartTableComponent {

    constructor(@Inject(UserHttpService) private userHttpService: UserHttpService,
                @Inject(UserHttpService) private userDbService: UserDbService) {
        super();
        super.setTableHeader('Users Management');
        super.setTableSettings(UserTableSettings);
    }
}

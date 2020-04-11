import {throwError} from 'rxjs';
import {OrganizationDataSource} from '../../services/implementation/system/organization/organization.datasource';
import OrganizationUtils from './organization.utils';
import {IOrganization} from '../../@core/data/system/organization';
import {UserDataSource} from '../../services/implementation/system/user/user.datasource';
import {IUser} from '../../@core/data/system/user';

export default class SystemDataUtils {

    /**
     * Get all organization
     * @param organizationDatasource to invoke
     */
    public static invokeAllOrganization(organizationDatasource: OrganizationDataSource): Promise<any[]> {
        organizationDatasource
        || throwError('OrganizationDataSource is required to invoke!');
        return organizationDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll().then(values => {
                return OrganizationUtils.buildOrganization(values as IOrganization[]);
            });
    }

    /**
     * Get all users and mapping returned data as the options of select control
     * @param organizationDatasource to invoke
     */
    public static invokeAllUsersAsSelectOptions(userDatasource: UserDataSource): Promise<any[]> {
        userDatasource
        || throwError('UserDataSource is required to invoke!');
        return userDatasource
            .setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll().then(values => {
                let options: { value: string, label: string }[];
                options = [];
                Array.from(values).forEach((value: IUser) => {
                    SystemDataUtils.mapUserAsSelectOptions(value, options);
                });
                return options;
            });
    }
    /**
     * Map the specified {IUser} into the return options array recursively
     * @param userValue to map
     * @param retValues to push returned values
     */
    private static mapUserAsSelectOptions(userValue: IUser, retValues: { value: string, label: string }[]): void {
        if (!userValue) return;

        if (!retValues) {
            retValues = [];
        }
        let userName: string;
        userName = userValue.username;
        if ((userValue.firstName || '').length || (userValue.lastName || '')) {
            userName = [(userValue.firstName || ''), (userValue.lastName || '')].join(' ').trim();
        }
        retValues.push({value: userValue.id, label: userName});
    }
}

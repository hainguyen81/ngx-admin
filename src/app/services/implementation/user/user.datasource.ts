import {Inject, Injectable} from '@angular/core';
import {UserDbService, UserHttpService} from './user.service';
import {AbstractDataSource} from '../../datasource.service';
import {IUser} from '../../../@core/data/user';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class UserDataSource extends AbstractDataSource<IUser, UserHttpService, UserDbService> {

    private latestCount: number = 0;

    constructor(@Inject(UserHttpService) httpService: UserHttpService,
                @Inject(UserDbService) dbService: UserDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
        super.setSort([{field: 'uid', direction: 'desc'}]);
    }

    getAll(): Promise<IUser | IUser[]> {
        // sort by uid desc
        return super.getDbService().getAll().then((users) => {
            users = this.filter(users);
            users = this.sort(users);
            this.latestCount = (users || []).length;
            users = this.paginate(users);
            return users;
        });
    }

    getElements(): Promise<IUser | IUser[]> {
        return this.getAll();
    }

    count(): number {
        return this.latestCount;
    }

    /**
     * Update new data by old data as key.
     * TODO remember return Promise of old data for updating view value
     * @param oldData to filter for updating and returning to update view value
     * @param newData to update into data source
     */
    update(oldData: IUser, newData: IUser): Promise<IUser> {
        return this.getDbService().update(newData).then(() => {
            this.refresh();
            return oldData;
        });
    }

    /**
     * Remove the specified data
     * @param data to remove
     * @return effected records number
     */
    remove(data: IUser): Promise<number> {
        return this.getDbService().delete(data).then(() => {
            this.refresh();
            return 1;
        });
    }

    load(data: Array<any>): Promise<any> {
        this.getLogger().debug('Load data', data);
        data = this.filter(data);
        data = this.sort(data);
        return super.load(data);
    }

    prepend(data: IUser): Promise<number> {
        return this.append(data);
    }

    append(data: IUser): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

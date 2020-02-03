import {Inject, Injectable} from '@angular/core';
import {UserDbService, UserHttpService} from './user.service';
import {AbstractDataSource} from '../../datasource.service';
import {IUser} from '../../../@core/data/user';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class UserDataSource extends AbstractDataSource<IUser, UserHttpService, UserDbService> {

    private keywords: string[];

    constructor(@Inject(UserHttpService) httpService: UserHttpService,
                @Inject(UserDbService) dbService: UserDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IUser | IUser[]> {
        // sort by uid desc
        return super.getDbService().getAll()
            .then((users) => users.sort(
                (u1, u2) => u1['uid'] > u2['uid'] ? -1 : u1['uid'] < u2['uid'] ? 1 : 0));
    }

    getElements(): Promise<IUser | IUser[]> {
        return this.getAll();
    }

    getFilter(): any {
        return this.keywords;
    }

    setFilter(conf: Array<any>, andOperator?: boolean, doEmit?: boolean): void {
        this.keywords = [];
    }

    count(): number {
        return 0;
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

    refresh(): void {
        this.getLogger().debug('Refresh data source');
        super.refresh();
    }

    load(data: Array<any>): Promise<any> {
        this.getLogger().debug('Load data', data);
        data.sort((a, b) => (a.uid > b.uid ? -1 : a.uid < b.uid ? 1 : 0));
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

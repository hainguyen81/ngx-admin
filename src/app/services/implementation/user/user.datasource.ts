import {Inject, Injectable} from '@angular/core';
import {UserDbService, UserHttpService} from './user.service';
import {AbstractDataSource} from '../../datasource.service';
import {IUser} from '../../../@core/data/user';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class UserDataSource extends AbstractDataSource<IUser, UserHttpService, UserDbService> {

    constructor(@Inject(UserHttpService) httpService: UserHttpService,
                @Inject(UserDbService) dbService: UserDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IUser | IUser[]> {
        return super.getDbService().getAll();
    }

    getElements(): Promise<IUser | IUser[]> {
        return this.getAll();
    }

    getFilter(): any {
        return undefined;
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

    refresh(): void {
        this.getLogger().debug('Refresh data source');
        super.refresh();
    }

    load(data: Array<any>): Promise<any> {
        this.getLogger().debug('Load data', data);
        return super.load(data);
    }
}

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

    update(oldData: IUser, newData: IUser): Promise<number> {
        return this.getDbService().update(newData);
    }
}

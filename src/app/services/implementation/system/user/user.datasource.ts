import {Inject, Injectable} from '@angular/core';
import {UserDbService, UserHttpService} from './user.service';
import {BaseDataSource} from '../../../common/datasource.service';
import {IUser} from '../../../../@core/data/system/user';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class UserDataSource extends BaseDataSource<IUser, UserHttpService, UserDbService> {

    constructor(@Inject(UserHttpService) httpService: UserHttpService,
                @Inject(UserDbService) dbService: UserDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

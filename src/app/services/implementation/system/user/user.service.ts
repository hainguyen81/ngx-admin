import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IUser} from '../../../../@core/data/system/user';
import {Constants as CommonConstants} from '../../../../@core/data/constants/common.constants';
import STATUS = CommonConstants.COMMON.STATUS;

@Injectable()
export class UserDbService extends BaseDbService<IUser> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.user);
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IUser[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            // if existed user
            if ((args[0].id || '').length) {
                args[0].status = STATUS.LOCKED.toString();
                this.updateExecutor.apply(this, [resolve, reject, ...args]);

                // if new user (invalid user identity)
            } else {
                this.getDbService().deleteRecord(this.getDbStore(), args[0]['uid'])
                    .then(() => resolve(1), (errors) => {
                        this.getLogger().error('Could not delete data', errors);
                        reject(errors);
                    });
            }
        } else resolve(0);
    }
}

@Injectable()
export class UserHttpService extends BaseHttpService<IUser> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(UserDbService) dbService: UserDbService) {
        super(http, logger, dbService);
    }
}

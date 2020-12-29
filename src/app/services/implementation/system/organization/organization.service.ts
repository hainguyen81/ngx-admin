import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {IOrganization} from '../../../../@core/data/system/organization';
import ObjectUtils from '../../../../utils/common/object.utils';

@Injectable({ providedIn: 'any' })
export class OrganizationDbService extends BaseDbService<IOrganization> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.organization);
    }

    deleteExecutor = (resolve: (value?: (PromiseLike<number> | number)) => void,
                      reject: (reason?: any) => void, ...args: IOrganization[]) => {
        if (args && args.length) {
            this.getLogger().debug('Delete data', args, 'First data', args[0]);
            this.getDbService().deleteRecord(this.getDbStore(), ObjectUtils.as<any>(args[0])['uid'])
                .then(() => resolve(1), (errors) => {
                    this.getLogger().error('Could not delete data', errors);
                    reject(errors);
                });
        } else resolve(0);
    }
}

@Injectable({ providedIn: 'any' })
export class OrganizationHttpService extends BaseHttpService<IOrganization> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(OrganizationDbService) dbService: OrganizationDbService) {
        super(http, logger, dbService);
    }
}

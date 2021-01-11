import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';
import {ICustomer} from '../../../../@core/data/system/customer';

@Injectable()
export class CustomerDbService extends BaseDbService<ICustomer> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.customer);
    }
}

@Injectable()
export class CustomerHttpService extends BaseHttpService<ICustomer> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(CustomerDbService) dbService: CustomerDbService) {
        super(http, logger, dbService);
    }
}

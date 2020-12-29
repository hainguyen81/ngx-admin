import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ICountry} from '../../../../@core/data/system/country';
import {BaseHttpService} from '../../../common/http.service';
import {HttpClient} from '@angular/common/http';
import {BaseDbService} from '../../../common/database.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DB_STORE} from '../../../../config/db.config';
import {ConnectionService} from 'ng-connection-service';

@Injectable({ providedIn: 'any' })
export class CountryDbService extends BaseDbService<ICountry> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService, DB_STORE.country);
    }
}

@Injectable({ providedIn: 'any' })
export class CountryHttpService extends BaseHttpService<ICountry> {

    constructor(@Inject(HttpClient) http: HttpClient,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(CountryDbService) dbService: CountryDbService) {
        super(http, logger, dbService);
    }
}

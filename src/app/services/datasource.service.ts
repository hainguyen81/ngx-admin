import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {IDbService, IHttpService} from './interface.service';
import {throwError} from 'rxjs';
import {Inject} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../config/log.config';
import {COMMON} from "../config/common.config";

export abstract class AbstractDataSource<T, H extends IHttpService<T>, D extends IDbService<T>> extends DataSource {

    protected getHttpService(): H {
        return this.httpService;
    }

    protected getDbService(): D {
        return this.dbService;
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected constructor(private httpService: H,
                          private dbService: D,
                          @Inject(NGXLogger) private logger: NGXLogger) {
        super();
        httpService || throwError('Not found HTTP service');
        dbService || throwError('Not found database service');
        logger || throwError('Could not inject logger!');
        logger.updateConfig(LogConfig);
    }

    getPaging(): any {
        return {
            page: 1,
            perPage: COMMON.itemsPerPage,
        };
    }
}

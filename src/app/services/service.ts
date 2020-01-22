import {IHttpService} from './interface.service';
import {IDbService} from './database.service';
import {throwError} from 'rxjs';

export abstract class AbstractService<T> {

    protected getDbService(): IDbService<T> {
        return this.dbService;
    }

    protected getHttpService(): IHttpService<T> {
        return this.httpService;
    }

    protected constructor(private httpService: IHttpService<T>,
                          private dbService: IDbService<T>) {
        if (!httpService) {
            throwError('Not found HTTP service!');
        }
        if (!dbService) {
            throwError('Not found database service!');
        }
    }
}

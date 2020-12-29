import {Inject, Injectable} from '@angular/core';
import {CustomerDbService, CustomerHttpService} from './customer.service';
import {BaseDataSource} from '../../../common/datasource.service';
import {ICustomer} from '../../../../@core/data/system/customer';
import {NGXLogger} from 'ngx-logger';

@Injectable({ providedIn: 'any' })
export class CustomerDatasource extends BaseDataSource<ICustomer, CustomerHttpService, CustomerDbService> {

    constructor(@Inject(CustomerHttpService) httpService: CustomerHttpService,
                @Inject(CustomerDbService) dbService: CustomerDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

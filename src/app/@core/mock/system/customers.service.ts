import {Inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../../config/log.config';
import {CustomerDbService} from '../../../services/implementation/system/customer/customer.service';
import {customersGenerate} from './mock.customer';
import {ICustomer} from '../../data/system/customer';
import {IMockService} from '../mock.service';
import {AppConfig} from '../../../config/app.config';

@Injectable({ providedIn: 'any' })
export class MockCustomerService implements IMockService {

    constructor(@Inject(CustomerDbService) private dbService: CustomerDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        dbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): Promise<any> {
        if (!AppConfig.Env.mock) {
            return Promise.resolve();
        }

        // just generate mock data if empty
        return this.dbService.count().then((recNumber: number) => {
            if (recNumber <= 0) {
                // generate mock data
                let mockCustomers: ICustomer[];
                mockCustomers = customersGenerate();
                this.logger.debug('Generate customers', mockCustomers);
                this.dbService.insertEntities(mockCustomers)
                    .then((affected: number) => this.logger.debug('Initialized mock customers data', affected),
                        (errors) => this.logger.error('Could not initialize mock customers data', errors));
            } else {
                this.logger.debug('Initialized mock customers data', recNumber);
            }
        });
    }
}

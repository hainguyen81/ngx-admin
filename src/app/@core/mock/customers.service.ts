import {Inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../config/log.config';
import {CustomerDbService} from '../../services/implementation/customer/customer.service';
import {MockCustomer} from './mock.customer';

@Injectable()
export class MockCustomerService {

    constructor(@Inject(CustomerDbService) private customerDbService: CustomerDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        customerDbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): void {
        if (environment.production) {
            return;
        }
        this.customerDbService.clear().then(() => {
            this.customerDbService.insertEntities(MockCustomer)
                .then(() => this.logger.debug('Initialized mock user data!'),
                    (errors) => this.logger.error('Could not initialize mock user data', errors));
        });
    }
}

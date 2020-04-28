import {Inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../../config/log.config';
import {WarehouseDbService} from '../../../services/implementation/warehouse/warehouse.storage/warehouse.service';
import {IWarehouse} from '../../data/warehouse/warehouse';
import {warehouseGenerate} from './mock.storage';
import {IMockService} from '../mock.service';

@Injectable()
export class MockWarehouseStorageService implements IMockService {

    constructor(@Inject(WarehouseDbService) private dbService: WarehouseDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        dbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): Promise<any> {
        if (environment.production) {
            return Promise.resolve();
        }

        // just generate mock data if empty
        return this.dbService.count().then((recNumber: number) => {
            if (recNumber <= 0) {
                // generate mock data
                let mockWarehouses: IWarehouse[];
                mockWarehouses = warehouseGenerate();
                this.logger.debug('Generate warehouses', mockWarehouses);
                this.dbService.insertEntities(mockWarehouses)
                    .then((affected: number) => this.logger.debug(
                        'Initialized mock warehouses data', affected),
                        (errors) => this.logger.error(
                            'Could not initialize mock warehouses data', errors));
            } else {
                this.logger.debug('Initialized mock warehouses data', recNumber);
            }
        });
    }
}

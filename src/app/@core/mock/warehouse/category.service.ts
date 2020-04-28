import {Inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../../config/log.config';
import {WarehouseCategoryDbService} from '../../../services/implementation/warehouse/warehouse.category/warehouse.category.service';
import {IWarehouseCategory} from '../../data/warehouse/warehouse.category';
import {categoryGenerate} from './mock.category';
import {IMockService} from '../mock.service';

@Injectable()
export class MockWarehouseCategoryService implements IMockService {

    constructor(@Inject(WarehouseCategoryDbService) private dbService: WarehouseCategoryDbService,
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
                let mockCategories: IWarehouseCategory[];
                mockCategories = categoryGenerate();
                this.logger.debug('Generate warehouse categories', mockCategories);
                this.dbService.insertEntities(mockCategories)
                    .then((affected: number) => this.logger.debug(
                        'Initialized mock warehouse categories data', affected),
                        (errors) => this.logger.error(
                            'Could not initialize mock warehouse categories data', errors));
            } else {
                this.logger.debug('Initialized mock warehouse categories data', recNumber);
            }
        });
    }
}

import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import {LogConfig} from '../../config/log.config';
import {CategoriesDbService} from '../../services/implementation/categories/categories.service';
import { environment } from '../../../environments/environment';
import { ICategories } from '../data/warehouse_catelogies';
import { categoriesGenerate } from './mock.categories';

@Injectable()
export class MockCategoriesService {
    constructor(@Inject(CategoriesDbService) private dbService: CategoriesDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        dbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): void {
        if (environment.production) {
            return;
        }

        // just generate mock data if empty
        this.dbService.count().then((recNumber: number) => {
            if (recNumber <= 0) {
                // generate mock data
                let mockOrganization: ICategories[];
                mockOrganization = categoriesGenerate();
                this.logger.debug('Generate organization', mockOrganization);
                this.dbService.insertEntities(mockOrganization)
                    .then((affected: number) => this.logger.debug('Initialized mock organization data', affected),
                        (errors) => this.logger.error('Could not initialize mock organization data', errors));
            } else {
                this.logger.debug('Initialized mock organization data', recNumber);
            }
        });
    }
}

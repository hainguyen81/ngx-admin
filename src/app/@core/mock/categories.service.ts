import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import {LogConfig} from '../../config/log.config';
import {CategoriesDbService} from '../../services/implementation/categories/categories.service';

@Injectable()
export class CategoriesService {
    constructor(@Inject(CategoriesDbService) private dbService: CategoriesDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        dbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }
}

import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../common/datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseCategory} from '../../../../@core/data/warehouse/warehouse.category';
import {WarehouseCategoryDbService, WarehouseCategoryHttpService} from './warehouse.category.service';

@Injectable({ providedIn: 'any' })
export class WarehouseCategoryDatasource
    extends BaseDataSource<IWarehouseCategory, WarehouseCategoryHttpService, WarehouseCategoryDbService> {

    constructor(@Inject(WarehouseCategoryHttpService) httpService: WarehouseCategoryHttpService,
                @Inject(WarehouseCategoryDbService) dbService: WarehouseCategoryDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

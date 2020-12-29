import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../common/datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseAdjust} from '../../../../@core/data/warehouse/warehouse.adjust';
import {WarehouseAdjustDbService, WarehouseAdjustHttpService} from './warehouse.adjust.service';

@Injectable({ providedIn: 'any' })
export class WarehouseAdjustDatasource
    extends BaseDataSource<IWarehouseAdjust, WarehouseAdjustHttpService, WarehouseAdjustDbService> {

    constructor(@Inject(WarehouseAdjustHttpService) httpService: WarehouseAdjustHttpService,
                @Inject(WarehouseAdjustDbService) dbService: WarehouseAdjustDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

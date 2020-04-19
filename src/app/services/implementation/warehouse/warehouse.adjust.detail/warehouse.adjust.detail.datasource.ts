import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseAdjustDetail} from '../../../../@core/data/warehouse/warehouse.adjust.detail';
import {WarehouseAdjustDetailDbService, WarehouseAdjustDetailHttpService} from './warehouse.adjust.detail.service';

@Injectable()
export class WarehouseAdjustDetailDatasource
    extends BaseDataSource<IWarehouseAdjustDetail,
        WarehouseAdjustDetailHttpService, WarehouseAdjustDetailDbService> {

    constructor(@Inject(WarehouseAdjustDetailHttpService) httpService: WarehouseAdjustDetailHttpService,
                @Inject(WarehouseAdjustDetailDbService) dbService: WarehouseAdjustDetailDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

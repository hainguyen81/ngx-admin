import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../common/datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseOrder} from '../../../../@core/data/warehouse/warehouse.order';
import {WarehouseOrderDbService, WarehouseOrderHttpService} from './warehouse.order.service';

@Injectable()
export class WarehouseOrderDatasource
    extends BaseDataSource<IWarehouseOrder, WarehouseOrderHttpService, WarehouseOrderDbService> {

    constructor(@Inject(WarehouseOrderHttpService) httpService: WarehouseOrderHttpService,
                @Inject(WarehouseOrderDbService) dbService: WarehouseOrderDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

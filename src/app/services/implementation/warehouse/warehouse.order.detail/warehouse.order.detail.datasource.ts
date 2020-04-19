import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseOrderDetail} from '../../../../@core/data/warehouse/warehouse.order.detail';
import {WarehouseOrderDetailDbService, WarehouseOrderDetailHttpService} from './warehouse.order.detail.service';

@Injectable()
export class WarehouseOrderDetailDatasource
    extends BaseDataSource<IWarehouseOrderDetail, WarehouseOrderDetailHttpService, WarehouseOrderDetailDbService> {

    constructor(@Inject(WarehouseOrderDetailHttpService) httpService: WarehouseOrderDetailHttpService,
                @Inject(WarehouseOrderDetailDbService) dbService: WarehouseOrderDetailDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

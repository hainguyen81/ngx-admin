import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../common/datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseInventory} from '../../../../@core/data/warehouse/warehouse.inventory';
import {WarehouseInventoryDbService, WarehouseInventoryHttpService} from './warehouse.inventory.service';

@Injectable({ providedIn: 'any' })
export class WarehouseInventoryDatasource
    extends BaseDataSource<IWarehouseInventory, WarehouseInventoryHttpService, WarehouseInventoryDbService> {

    constructor(@Inject(WarehouseInventoryHttpService) httpService: WarehouseInventoryHttpService,
                @Inject(WarehouseInventoryDbService) dbService: WarehouseInventoryDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouse} from '../../../../@core/data/warehouse/warehouse';
import {WarehouseDbService, WarehouseHttpService} from './warehouse.service';

@Injectable()
export class WarehouseDatasource extends BaseDataSource<IWarehouse, WarehouseHttpService, WarehouseDbService> {

    constructor(@Inject(WarehouseHttpService) httpService: WarehouseHttpService,
                @Inject(WarehouseDbService) dbService: WarehouseDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getStoragesByPath(warehouseIdOrCode: string, retStorages: IWarehouse[], byCode?: boolean | true): Promise<void> {
        return this.getDbService().getStoragesByPath(warehouseIdOrCode, retStorages, byCode);
    }
}

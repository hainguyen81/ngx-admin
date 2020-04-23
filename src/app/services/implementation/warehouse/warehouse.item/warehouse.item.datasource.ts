import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseItem} from '../../../../@core/data/warehouse/warehouse.item';
import {WarehouseItemDbService, WarehouseItemHttpService} from './warehouse.item.service';

@Injectable()
export class WarehouseItemDatasource
    extends BaseDataSource<IWarehouseItem, WarehouseItemHttpService, WarehouseItemDbService> {

    constructor(@Inject(WarehouseItemHttpService) httpService: WarehouseItemHttpService,
                @Inject(WarehouseItemDbService) dbService: WarehouseItemDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}
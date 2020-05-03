import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseItem} from '../../../../@core/data/warehouse/warehouse.item';
import {WarehouseItemDbService, WarehouseItemHttpService} from './warehouse.item.service';
import {isNullOrUndefined} from 'util';
import {IdGenerators} from '../../../../config/generator.config';
import PromiseUtils from '../../../../utils/promise.utils';

@Injectable()
export class WarehouseItemDatasource
    extends BaseDataSource<IWarehouseItem, WarehouseItemHttpService, WarehouseItemDbService> {

    constructor(@Inject(WarehouseItemHttpService) httpService: WarehouseItemHttpService,
                @Inject(WarehouseItemDbService) dbService: WarehouseItemDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    public save(elements: IWarehouseItem[]): Promise<number> {
        return this.getDbService().saveEntities(elements);
    }
}

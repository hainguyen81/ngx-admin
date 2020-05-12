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

    getAll(): Promise<IWarehouseItem | IWarehouseItem[]> {
        return super.getAllByIndex('is_version', IDBKeyRange.only(false));
    }

    public save(elements: IWarehouseItem[]): Promise<number> {
        return this.getDbService().saveEntities(elements)
            .then(value => {
                this.refresh();
                return value;
            }, reason => {
                this.getLogger().error(reason);
                return 0;
            }).catch(reason => {
                this.getLogger().error(reason);
                return 0;
            });
    }
}

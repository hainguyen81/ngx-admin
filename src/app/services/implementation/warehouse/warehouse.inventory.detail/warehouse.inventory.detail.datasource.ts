import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../common/datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseInventoryDetail} from '../../../../@core/data/warehouse/warehouse.inventory.detail';
import {WarehouseInventoryDetailDbService, WarehouseInventoryDetailHttpService,} from './warehouse.inventory.detail.service';

@Injectable()
export class WarehouseInventoryDetailDatasource
    extends BaseDataSource<IWarehouseInventoryDetail,
        WarehouseInventoryDetailHttpService, WarehouseInventoryDetailDbService> {

    constructor(@Inject(WarehouseInventoryDetailHttpService) httpService: WarehouseInventoryDetailHttpService,
                @Inject(WarehouseInventoryDetailDbService) dbService: WarehouseInventoryDetailDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    public save(elements: IWarehouseInventoryDetail[]): Promise<number> {
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

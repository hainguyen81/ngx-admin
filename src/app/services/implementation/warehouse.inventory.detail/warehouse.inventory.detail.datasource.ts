import {Inject, Injectable} from '@angular/core';
import {AbstractDataSource} from '../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseInventoryDetail} from '../../../@core/data/warehouse.inventory.detail';
import {
    WarehouseInventoryDetailDbService,
    WarehouseInventoryDetailHttpService,
} from './warehouse.inventory.detail.service';

@Injectable()
export class WarehouseInventoryDetailDatasource
    extends AbstractDataSource<IWarehouseInventoryDetail,
        WarehouseInventoryDetailHttpService, WarehouseInventoryDetailDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseInventoryDetailHttpService) httpService: WarehouseInventoryDetailHttpService,
                @Inject(WarehouseInventoryDetailDbService) dbService: WarehouseInventoryDetailDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseInventoryDetail | IWarehouseInventoryDetail[]> {
        return super.getDbService().getAll().then((customers: IWarehouseInventoryDetail[]) => {
            customers = this.filter(customers);
            customers = this.sort(customers);
            this.latestCount = (customers || []).length;
            customers = this.paginate(customers);
            return customers;
        });
    }

    getElements(): Promise<IWarehouseInventoryDetail | IWarehouseInventoryDetail[]> {
        return this.getAll();
    }

    count(): number {
        return this.latestCount;
    }

    /**
     * Update new data by old data as key.
     * TODO remember return Promise of old data for updating view value
     * @param oldData to filter for updating and returning to update view value
     * @param newData to update into data source
     */
    update(oldData: IWarehouseInventoryDetail, newData: IWarehouseInventoryDetail): Promise<IWarehouseInventoryDetail> {
        return this.getDbService().update(newData).then(() => {
            this.refresh();
            return oldData;
        });
    }

    /**
     * Remove the specified data
     * @param data to remove
     * @return effected records number
     */
    remove(data: IWarehouseInventoryDetail): Promise<number> {
        return this.getDbService().delete(data).then(() => {
            this.refresh();
            return 1;
        });
    }

    refresh(): void {
        this.getLogger().debug('Refresh data source');
        super.refresh();
    }

    load(data: Array<any>): Promise<any> {
        this.getLogger().debug('Load data', data);
        return super.load(data);
    }

    prepend(data: IWarehouseInventoryDetail): Promise<number> {
        return this.append(data);
    }

    append(data: IWarehouseInventoryDetail): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

import {Inject, Injectable} from '@angular/core';
import {AbstractDataSource} from '../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseInventory} from '../../../@core/data/warehouse.inventory';
import {WarehouseInventoryDbService, WarehouseInventoryHttpService} from './warehouse.inventory.service';

@Injectable()
export class WarehouseInventoryDatasource
    extends AbstractDataSource<IWarehouseInventory, WarehouseInventoryHttpService, WarehouseInventoryDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseInventoryHttpService) httpService: WarehouseInventoryHttpService,
                @Inject(WarehouseInventoryDbService) dbService: WarehouseInventoryDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseInventory | IWarehouseInventory[]> {
        return super.getDbService().getAll().then((customers: IWarehouseInventory[]) => {
            customers = this.filter(customers);
            customers = this.sort(customers);
            this.latestCount = (customers || []).length;
            customers = this.paginate(customers);
            return customers;
        });
    }

    getElements(): Promise<IWarehouseInventory | IWarehouseInventory[]> {
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
    update(oldData: IWarehouseInventory, newData: IWarehouseInventory): Promise<IWarehouseInventory> {
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
    remove(data: IWarehouseInventory): Promise<number> {
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

    prepend(data: IWarehouseInventory): Promise<number> {
        return this.append(data);
    }

    append(data: IWarehouseInventory): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

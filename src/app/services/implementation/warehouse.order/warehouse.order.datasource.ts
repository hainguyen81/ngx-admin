import {Inject, Injectable} from '@angular/core';
import {AbstractDataSource} from '../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseOrder} from '../../../@core/data/warehouse.order';
import {WarehouseOrderDbService, WarehouseOrderHttpService} from './warehouse.order.service';

@Injectable()
export class WarehouseOrderDatasource
    extends AbstractDataSource<IWarehouseOrder, WarehouseOrderHttpService, WarehouseOrderDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseOrderHttpService) httpService: WarehouseOrderHttpService,
                @Inject(WarehouseOrderDbService) dbService: WarehouseOrderDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseOrder | IWarehouseOrder[]> {
        return super.getDbService().getAll().then((customers: IWarehouseOrder[]) => {
            customers = this.filter(customers);
            customers = this.sort(customers);
            this.latestCount = (customers || []).length;
            customers = this.paginate(customers);
            return customers;
        });
    }

    getElements(): Promise<IWarehouseOrder | IWarehouseOrder[]> {
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
    update(oldData: IWarehouseOrder, newData: IWarehouseOrder): Promise<IWarehouseOrder> {
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
    remove(data: IWarehouseOrder): Promise<number> {
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

    prepend(data: IWarehouseOrder): Promise<number> {
        return this.append(data);
    }

    append(data: IWarehouseOrder): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

import {Inject, Injectable} from '@angular/core';
import {AbstractDataSource} from '../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseOrderDetail} from '../../../@core/data/warehouse.order.detail';
import {WarehouseOrderDetailDbService, WarehouseOrderDetailHttpService} from './warehouse.order.detail.service';

@Injectable()
export class WarehouseOrderDetailDatasource
    extends AbstractDataSource<IWarehouseOrderDetail, WarehouseOrderDetailHttpService, WarehouseOrderDetailDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseOrderDetailHttpService) httpService: WarehouseOrderDetailHttpService,
                @Inject(WarehouseOrderDetailDbService) dbService: WarehouseOrderDetailDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseOrderDetail | IWarehouseOrderDetail[]> {
        return super.getDbService().getAll().then((customers: IWarehouseOrderDetail[]) => {
            customers = this.filter(customers);
            customers = this.sort(customers);
            this.latestCount = (customers || []).length;
            customers = this.paginate(customers);
            return customers;
        });
    }

    getElements(): Promise<IWarehouseOrderDetail | IWarehouseOrderDetail[]> {
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
    update(oldData: IWarehouseOrderDetail, newData: IWarehouseOrderDetail): Promise<IWarehouseOrderDetail> {
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
    remove(data: IWarehouseOrderDetail): Promise<number> {
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

    prepend(data: IWarehouseOrderDetail): Promise<number> {
        return this.append(data);
    }

    append(data: IWarehouseOrderDetail): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

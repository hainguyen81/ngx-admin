import {Inject, Injectable} from '@angular/core';
import {AbstractDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseAdjust} from '../../../../@core/data/warehouse/warehouse.adjust';
import {WarehouseAdjustDbService, WarehouseAdjustHttpService} from './warehouse.adjust.service';

@Injectable()
export class WarehouseAdjustDatasource
    extends AbstractDataSource<IWarehouseAdjust, WarehouseAdjustHttpService, WarehouseAdjustDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseAdjustHttpService) httpService: WarehouseAdjustHttpService,
                @Inject(WarehouseAdjustDbService) dbService: WarehouseAdjustDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseAdjust | IWarehouseAdjust[]> {
        return super.getDbService().getAll().then((customers: IWarehouseAdjust[]) => {
            customers = this.filter(customers);
            customers = this.sort(customers);
            this.latestCount = (customers || []).length;
            customers = this.paginate(customers);
            return customers;
        });
    }

    getElements(): Promise<IWarehouseAdjust | IWarehouseAdjust[]> {
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
    update(oldData: IWarehouseAdjust, newData: IWarehouseAdjust): Promise<IWarehouseAdjust> {
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
    remove(data: IWarehouseAdjust): Promise<number> {
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

    prepend(data: IWarehouseAdjust): Promise<number> {
        return this.append(data);
    }

    append(data: IWarehouseAdjust): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

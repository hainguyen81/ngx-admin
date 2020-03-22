import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {AbstractDataSource} from '../../../../datasource.service';
import {IWarehouseItemSmartTable} from '../../../../../@core/data/warehouse-item.smarttable';
import {
    WarehouseItemSmartTableDbService,
    WarehouseItemSmartTableHttpService,
} from './warehouse-item.smarttable.service';


@Injectable({
    providedIn: 'root',
})
export class WarehouseItemSmartTableDatasource extends
    AbstractDataSource<IWarehouseItemSmartTable, WarehouseItemSmartTableHttpService, WarehouseItemSmartTableDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseItemSmartTableHttpService) httpService: WarehouseItemSmartTableHttpService,
                @Inject(WarehouseItemSmartTableDbService) dbService: WarehouseItemSmartTableDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseItemSmartTable | IWarehouseItemSmartTable[]> {
        return super.getDbService().getAll().then((WarehouseItemSmartTables: IWarehouseItemSmartTable[]) => {
            WarehouseItemSmartTables = this.filter(WarehouseItemSmartTables);
            WarehouseItemSmartTables = this.sort(WarehouseItemSmartTables);
            this.latestCount = (WarehouseItemSmartTables || []).length;
            WarehouseItemSmartTables = this.paginate(WarehouseItemSmartTables);
            return WarehouseItemSmartTables;
        });
    }

    getElements(): Promise<IWarehouseItemSmartTable | IWarehouseItemSmartTable[]> {
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
    update(oldData: IWarehouseItemSmartTable, newData: IWarehouseItemSmartTable): Promise<IWarehouseItemSmartTable> {
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
    remove(data: IWarehouseItemSmartTable): Promise<number> {
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

    prepend(data: IWarehouseItemSmartTable): Promise<number> {
        return this.append(data);
    }

    append(data: IWarehouseItemSmartTable): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

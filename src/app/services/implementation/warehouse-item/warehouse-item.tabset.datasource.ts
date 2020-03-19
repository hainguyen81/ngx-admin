import {Inject, Injectable} from '@angular/core';
import {WarehouseItemDbService, WarehouseItemHttpService} from './warehouse-item.service';
import {AbstractDataSource} from '../../datasource.service';
import {IWarehouseItemSmartTable} from '../../../@core/data/warehouse-item.smarttable';
import {NGXLogger} from 'ngx-logger';

@Injectable()
// tslint:disable-next-line: max-line-length
export class WarehouseItemTabsetDatasource extends AbstractDataSource<IWarehouseItemSmartTable, WarehouseItemHttpService, WarehouseItemDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseItemHttpService) httpService: WarehouseItemHttpService,
                @Inject(WarehouseItemDbService) dbService: WarehouseItemDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseItemSmartTable | IWarehouseItemSmartTable[]> {
        return super.getDbService().getAll().then((WarehouseItems: IWarehouseItemSmartTable[]) => {
            WarehouseItems = this.filter(WarehouseItems);
            WarehouseItems = this.sort(WarehouseItems);
            this.latestCount = (WarehouseItems || []).length;
            WarehouseItems = this.paginate(WarehouseItems);
            return WarehouseItems;
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

import {Inject, Injectable} from '@angular/core';
import {WarehouseItemFlipcardDbService, WarehouseItemFlipcardHttpService} from './warehouse-item.flipcard.service';
import {AbstractDataSource} from '../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import IWarehouseItemFlipcard from '../../../@core/data/warehouse-item/partial/warehouse-flipcard';

@Injectable()
// tslint:disable-next-line: max-line-length
export class WarehouseItemFlipcardDatasource extends AbstractDataSource<IWarehouseItemFlipcard, WarehouseItemFlipcardHttpService, WarehouseItemFlipcardDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseItemFlipcardHttpService) httpService: WarehouseItemFlipcardHttpService,
                @Inject(WarehouseItemFlipcardDbService) dbService: WarehouseItemFlipcardDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseItemFlipcard | IWarehouseItemFlipcard[]> {
        return Promise.resolve([]);
    }

    getElements(): Promise<IWarehouseItemFlipcard | IWarehouseItemFlipcard[]> {
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
    update(oldData: IWarehouseItemFlipcard, newData: IWarehouseItemFlipcard): Promise<IWarehouseItemFlipcard> {
        return Promise.resolve(new IWarehouseItemFlipcard());
    }

    /**
     * Remove the specified data
     * @param data to remove
     * @return effected records number
     */
    remove(data: IWarehouseItemFlipcard): Promise<number> {
        return Promise.resolve(0);
    }

    refresh(): void {}

    load(data: Array<any>): Promise<any> {
        return Promise.resolve();
    }

    prepend(data: IWarehouseItemFlipcard): Promise<number> {
        return Promise.resolve(0);
    }

    append(data: IWarehouseItemFlipcard): Promise<any> {
        return Promise.resolve();
    }
}

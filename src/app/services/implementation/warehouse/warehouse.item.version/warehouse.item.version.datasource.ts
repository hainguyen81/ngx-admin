import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseItem} from '../../../../@core/data/warehouse/warehouse.item';
import {WarehouseItemVersionDbService, WarehouseItemVersionHttpService} from './warehouse.item.version.service';

@Injectable()
export class WarehouseItemVersionDatasource
    extends BaseDataSource<IWarehouseItem, WarehouseItemVersionHttpService, WarehouseItemVersionDbService> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private dataModel?: IWarehouseItem | null;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    public getDataModel(): IWarehouseItem {
        return this.dataModel;
    }

    public setDataModel(dataModel?: IWarehouseItem | null) {
        this.dataModel = dataModel;
        super.reset(true);
        super.refresh();
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    constructor(@Inject(WarehouseItemVersionHttpService) httpService: WarehouseItemVersionHttpService,
                @Inject(WarehouseItemVersionDbService) dbService: WarehouseItemVersionDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    getAll(): Promise<IWarehouseItem[] | IWarehouseItem> {
        const modelCode: string = (this.dataModel ? this.dataModel.code : undefined);
        return (!(modelCode || '').length ? Promise.resolve([])
            : super.getAllByIndex('item_code', IDBKeyRange.only(modelCode)));
    }
}

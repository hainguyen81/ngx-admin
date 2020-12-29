import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../common/datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseManagement} from '../../../../@core/data/warehouse/warehouse.management';
import {WarehouseManagementDbService, WarehouseManagementHttpService} from './warehouse.management.service';

@Injectable({ providedIn: 'any' })
export class WarehouseManagementDatasource
    extends BaseDataSource<IWarehouseManagement, WarehouseManagementHttpService, WarehouseManagementDbService> {

    constructor(@Inject(WarehouseManagementHttpService) httpService: WarehouseManagementHttpService,
                @Inject(WarehouseManagementDbService) dbService: WarehouseManagementDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

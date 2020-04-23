import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseSetting} from '../../../../@core/data/warehouse/warehouse.setting';
import {
    WarehouseSettingsDbService,
    WarehouseSettingsHttpService,
} from './warehouse.settings.service';

@Injectable()
export class WarehouseSettingsDatasource
    extends BaseDataSource<IWarehouseSetting, WarehouseSettingsHttpService, WarehouseSettingsDbService> {

    constructor(@Inject(WarehouseSettingsHttpService) httpService: WarehouseSettingsHttpService,
                @Inject(WarehouseSettingsDbService) dbService: WarehouseSettingsDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseBatchNo} from '../../../../@core/data/warehouse/warehouse.batch.no';
import {WarehouseBatchNoDbService, WarehouseBatchNoHttpService} from './warehouse.batchno.service';

@Injectable()
export class WarehouseBatchNoDatasource
    extends BaseDataSource<IWarehouseBatchNo, WarehouseBatchNoHttpService, WarehouseBatchNoDbService> {

    constructor(@Inject(WarehouseBatchNoHttpService) httpService: WarehouseBatchNoHttpService,
                @Inject(WarehouseBatchNoDbService) dbService: WarehouseBatchNoDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

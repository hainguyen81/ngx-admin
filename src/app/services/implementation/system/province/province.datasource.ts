import {Inject, Injectable} from '@angular/core';
import {ProvinceDbService, ProvinceHttpService} from './province.service';
import {BaseDataSource} from '../../../datasource.service';
import {IProvince} from '../../../../@core/data/system/province';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class ProvinceDatasource extends BaseDataSource<IProvince, ProvinceHttpService, ProvinceDbService> {

    constructor(@Inject(ProvinceHttpService) httpService: ProvinceHttpService,
                @Inject(ProvinceDbService) dbService: ProvinceDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

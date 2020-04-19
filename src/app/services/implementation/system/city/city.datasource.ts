import {Inject, Injectable} from '@angular/core';
import {CityDbService, CityHttpService} from './city.service';
import {BaseDataSource} from '../../../datasource.service';
import {ICity} from '../../../../@core/data/system/city';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class CityDatasource extends BaseDataSource<ICity, CityHttpService, CityDbService> {

    constructor(@Inject(CityHttpService) httpService: CityHttpService,
                @Inject(CityDbService) dbService: CityDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

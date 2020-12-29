import {Inject, Injectable} from '@angular/core';
import {CountryDbService, CountryHttpService} from './country.service';
import {BaseDataSource} from '../../../common/datasource.service';
import {ICountry} from '../../../../@core/data/system/country';
import {NGXLogger} from 'ngx-logger';

@Injectable({ providedIn: 'any' })
export class CountryDatasource extends BaseDataSource<ICountry, CountryHttpService, CountryDbService> {

    constructor(@Inject(CountryHttpService) httpService: CountryHttpService,
                @Inject(CountryDbService) dbService: CountryDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

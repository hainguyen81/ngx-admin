import {Inject, Injectable} from '@angular/core';
import {CityDbService, CityHttpService} from './city.service';
import {BaseDataSource} from '../../../datasource.service';
import {ICity} from '../../../../@core/data/system/city';
import {NGXLogger} from 'ngx-logger';
import {ICountry} from '../../../../@core/data/system/country';

@Injectable()
export class CityDatasource extends BaseDataSource<ICity, CityHttpService, CityDbService> {

    constructor(@Inject(CityHttpService) httpService: CityHttpService,
                @Inject(CityDbService) dbService: CityDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    /**
     * Find all cities by the specified {ICountry}
     * @param country to filter
     */
    findByCountry(country?: ICountry): Promise<ICity[] | ICity> {
        return super.getDbService().findByCountry(country)
            .then(this.onFulfilledData(), reason => {
                this.getLogger().error(reason);
                return [];
            }).catch(reason => {
                this.getLogger().error(reason);
                return [];
            });
    }
}

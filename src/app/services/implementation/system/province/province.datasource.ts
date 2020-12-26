import {Inject, Injectable} from '@angular/core';
import {ProvinceDbService, ProvinceHttpService} from './province.service';
import {BaseDataSource} from '../../../common/datasource.service';
import {IProvince} from '../../../../@core/data/system/province';
import {NGXLogger} from 'ngx-logger';
import {ICountry} from '../../../../@core/data/system/country';

@Injectable()
export class ProvinceDatasource extends BaseDataSource<IProvince, ProvinceHttpService, ProvinceDbService> {

    constructor(@Inject(ProvinceHttpService) httpService: ProvinceHttpService,
                @Inject(ProvinceDbService) dbService: ProvinceDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    /**
     * Find all provinces by the specified {ICountry}
     * @param country to filter
     */
    findByCountry(country?: ICountry): Promise<IProvince[] | IProvince> {
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

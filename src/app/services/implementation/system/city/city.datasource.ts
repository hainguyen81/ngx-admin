import {Inject, Injectable} from '@angular/core';
import {CityDbService, CityHttpService} from './city.service';
import {BaseDataSource} from '../../../common/datasource.service';
import {ICity} from '../../../../@core/data/system/city';
import {NGXLogger} from 'ngx-logger';
import {IProvince} from '../../../../@core/data/system/province';

@Injectable()
export class CityDatasource extends BaseDataSource<ICity, CityHttpService, CityDbService> {

    constructor(@Inject(CityHttpService) httpService: CityHttpService,
                @Inject(CityDbService) dbService: CityDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    /**
     * Find all cities by the specified {IProvince}
     * @param province to filter
     */
    findByProvince(province?: IProvince): Promise<ICity[] | ICity> {
        return super.getDbService().findByProvince(province)
            .then(this.onFulfilledData(), reason => {
                this.getLogger().error(reason);
                return [];
            }).catch(reason => {
                this.getLogger().error(reason);
                return [];
            });
    }
}

import {Inject, Injectable} from '@angular/core';
import {CityDbService, CityHttpService} from './city.service';
import {AbstractDataSource} from '../../../datasource.service';
import {ICity} from '../../../../@core/data/system/city';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class CityDatasource extends AbstractDataSource<ICity, CityHttpService, CityDbService> {

    private latestCount: number = 0;

    constructor(@Inject(CityHttpService) httpService: CityHttpService,
                @Inject(CityDbService) dbService: CityDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<ICity | ICity[]> {
        return super.getDbService().getAll().then((cities: ICity[]) => {
            cities = this.filter(cities);
            cities = this.sort(cities);
            this.latestCount = (cities || []).length;
            cities = this.paginate(cities);
            return cities;
        });
    }

    getElements(): Promise<ICity | ICity[]> {
        return this.getAll();
    }

    count(): number {
        return this.latestCount;
    }

    /**
     * Update new data by old data as key.
     * TODO remember return Promise of old data for updating view value
     * @param oldData to filter for updating and returning to update view value
     * @param newData to update into data source
     */
    update(oldData: ICity, newData: ICity): Promise<ICity> {
        return this.getDbService().update(newData).then(() => {
            this.refresh();
            return oldData;
        });
    }

    /**
     * Remove the specified data
     * @param data to remove
     * @return effected records number
     */
    remove(data: ICity): Promise<number> {
        return this.getDbService().delete(data).then(() => {
            this.refresh();
            return 1;
        });
    }

    refresh(): void {
        this.getLogger().debug('Refresh data source');
        super.refresh();
    }

    load(data: Array<any>): Promise<any> {
        this.getLogger().debug('Load data', data);
        return super.load(data);
    }

    prepend(data: ICity): Promise<number> {
        return this.append(data);
    }

    append(data: ICity): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

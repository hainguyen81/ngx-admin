import {Inject, Injectable} from '@angular/core';
import {CountryDbService, CountryHttpService} from './country.service';
import {AbstractDataSource} from '../../../datasource.service';
import {ICountry} from '../../../../@core/data/system/country';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class CountryDatasource extends AbstractDataSource<ICountry, CountryHttpService, CountryDbService> {

    private latestCount: number = 0;

    constructor(@Inject(CountryHttpService) httpService: CountryHttpService,
                @Inject(CountryDbService) dbService: CountryDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<ICountry | ICountry[]> {
        return super.getDbService().getAll().then((countries: ICountry[]) => {
            countries = this.filter(countries);
            countries = this.sort(countries);
            this.latestCount = (countries || []).length;
            countries = this.paginate(countries);
            return countries;
        });
    }

    getElements(): Promise<ICountry | ICountry[]> {
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
    update(oldData: ICountry, newData: ICountry): Promise<ICountry> {
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
    remove(data: ICountry): Promise<number> {
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

    prepend(data: ICountry): Promise<number> {
        return this.append(data);
    }

    append(data: ICountry): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

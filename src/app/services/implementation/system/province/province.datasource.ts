import {Inject, Injectable} from '@angular/core';
import {ProvinceDbService, ProvinceHttpService} from './province.service';
import {AbstractDataSource} from '../../../datasource.service';
import {IProvince} from '../../../../@core/data/system/province';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class ProvinceDatasource extends AbstractDataSource<IProvince, ProvinceHttpService, ProvinceDbService> {

    private latestCount: number = 0;

    constructor(@Inject(ProvinceHttpService) httpService: ProvinceHttpService,
                @Inject(ProvinceDbService) dbService: ProvinceDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IProvince | IProvince[]> {
        return super.getDbService().getAll().then((provinces: IProvince[]) => {
            provinces = this.filter(provinces);
            provinces = this.sort(provinces);
            this.latestCount = (provinces || []).length;
            provinces = this.paginate(provinces);
            return provinces;
        });
    }

    getElements(): Promise<IProvince | IProvince[]> {
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
    update(oldData: IProvince, newData: IProvince): Promise<IProvince> {
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
    remove(data: IProvince): Promise<number> {
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

    prepend(data: IProvince): Promise<number> {
        return this.append(data);
    }

    append(data: IProvince): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

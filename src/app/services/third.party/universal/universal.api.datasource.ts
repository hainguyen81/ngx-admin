import {Inject, Injectable} from '@angular/core';
import {AbstractDataSource} from '../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IApiThirdParty} from '../../../@core/data/system/api.third.party';
import {UniversalApiDbService, UniversalApiHttpService} from './universal.api.service';

@Injectable()
export class UniversalApiDatasource
    extends AbstractDataSource<IApiThirdParty, UniversalApiHttpService, UniversalApiDbService> {

    private latestCount: number = 0;

    constructor(@Inject(UniversalApiHttpService) httpService: UniversalApiHttpService,
                @Inject(UniversalApiDbService) dbService: UniversalApiDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IApiThirdParty | IApiThirdParty[]> {
        return super.getDbService().getAll().then((data: IApiThirdParty[]) => {
            data = this.filter(data);
            data = this.sort(data);
            this.latestCount = (data || []).length;
            data = this.paginate(data);
            return data;
        });
    }

    getElements(): Promise<IApiThirdParty | IApiThirdParty[]> {
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
    update(oldData: IApiThirdParty, newData: IApiThirdParty): Promise<IApiThirdParty> {
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
    remove(data: IApiThirdParty): Promise<number> {
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

    prepend(data: IApiThirdParty): Promise<number> {
        return this.append(data);
    }

    append(data: IApiThirdParty): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

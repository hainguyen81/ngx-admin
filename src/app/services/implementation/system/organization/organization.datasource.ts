import {Inject, Injectable} from '@angular/core';
import {AbstractDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IOrganization} from '../../../../@core/data/system/organization';
import {OrganizationDbService, OrganizationHttpService} from './organization.service';

@Injectable()
export class OrganizationDataSource
    extends AbstractDataSource<IOrganization, OrganizationHttpService, OrganizationDbService> {

    private latestCount: number = 0;

    constructor(@Inject(OrganizationHttpService) httpService: OrganizationHttpService,
                @Inject(OrganizationDbService) dbService: OrganizationDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
        super.setSort([{field: 'uid', direction: 'desc'}]);
    }

    getAll(): Promise<IOrganization | IOrganization[]> {
        // sort by uid desc
        return super.getDbService().getAll().then((data) => {
            data = this.filter(data);
            data = this.sort(data);
            this.latestCount = (data || []).length;
            data = this.paginate(data);
            return data;
        });
    }

    getElements(): Promise<IOrganization | IOrganization[]> {
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
    update(oldData: IOrganization, newData: IOrganization): Promise<IOrganization> {
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
    remove(data: IOrganization): Promise<number> {
        return this.getDbService().delete(data).then(() => {
            this.refresh();
            return 1;
        });
    }

    load(data: Array<any>): Promise<any> {
        this.getLogger().debug('Load data', data);
        data = this.filter(data);
        data = this.sort(data);
        return super.load(data);
    }

    prepend(data: IOrganization): Promise<number> {
        return this.append(data);
    }

    append(data: IOrganization): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

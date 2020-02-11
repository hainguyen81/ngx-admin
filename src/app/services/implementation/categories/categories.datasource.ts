import {AbstractDataSource} from '../../datasource.service';
import {ICategories} from '../../../@core/data/warehouse_catelogies';
import {CategoriesDbService, CategoriesHttpService} from './categories.service';
import {Inject} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

export class CategoriesDataSource extends AbstractDataSource<ICategories, CategoriesHttpService, CategoriesDbService> {
    private latestCount: number = 0;

    constructor(@Inject(CategoriesHttpService) httpService: CategoriesHttpService,
                @Inject(CategoriesDbService) dbService: CategoriesDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
        super.setSort([{field: 'uid', direction: 'desc'}]);
    }

    getAll(): Promise<ICategories | ICategories[]> {
        // sort by uid desc
        return super.getDbService().getAll().then((data) => {
            data = this.filter(data);
            data = this.sort(data);
            this.latestCount = (data || []).length;
            data = this.paginate(data);
            return data;
        });
    }

    getElements(): Promise<ICategories | ICategories[]> {
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
    update(oldData: ICategories, newData: ICategories): Promise<ICategories> {
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
    remove(data: ICategories): Promise<number> {
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

    prepend(data: ICategories): Promise<number> {
        return this.append(data);
    }

    append(data: ICategories): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }

}

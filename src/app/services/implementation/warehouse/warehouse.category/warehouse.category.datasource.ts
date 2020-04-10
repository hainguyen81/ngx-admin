import {Inject, Injectable} from '@angular/core';
import {AbstractDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseCategory} from '../../../../@core/data/warehouse/warehouse.category';
import {WarehouseCategoryDbService, WarehouseCategoryHttpService} from './warehouse.category.service';
import {throwError} from 'rxjs';
import ObjectUtils from '../../../../utils/object.utils';

@Injectable()
export class WarehouseCategoryDatasource
    extends AbstractDataSource<IWarehouseCategory, WarehouseCategoryHttpService, WarehouseCategoryDbService> {

    private latestCount: number = 0;

    constructor(@Inject(WarehouseCategoryHttpService) httpService: WarehouseCategoryHttpService,
                @Inject(WarehouseCategoryDbService) dbService: WarehouseCategoryDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<IWarehouseCategory | IWarehouseCategory[]> {
        return super.getDbService().getAll().then((customers: IWarehouseCategory[]) => {
            customers = this.filter(customers);
            customers = this.sort(customers);
            this.latestCount = (customers || []).length;
            customers = this.paginate(customers);
            return customers;
        });
    }

    getById(categoryId?: string | null): Promise<IWarehouseCategory> {
        return super.getDbService().findById(categoryId);
    }

    getElements(): Promise<IWarehouseCategory | IWarehouseCategory[]> {
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
    update(oldData: IWarehouseCategory, newData: IWarehouseCategory): Promise<IWarehouseCategory> {
        if (!(oldData.parentId || '').length) {
            if (!(newData.parentId || '').length) {
                return this.getDbService().update(newData).then(() => {
                    this.refresh();
                    return oldData;
                });

            } else {
                return this.getDbService().findById(newData.parentId)
                    .then(parent => {
                        !parent || throwError(
                            'Could not found the NEW parent by id {' + newData.parentId + '}');
                        parent.children = (parent.children || []);
                        let newChild: IWarehouseCategory;
                        newChild = ObjectUtils.deepCopy(newData);
                        delete newChild['uid'];
                        parent.children.push(newChild);
                        return this.getDbService().update(parent).then(() => {
                            return this.getDbService().deletePernament(newData).then(() => {
                                this.refresh();
                                return oldData;
                            });
                        });
                    });
            }

        } else {
            return this.getDbService().findById(oldData.parentId)
                .then(oldParent => {
                    !oldParent || throwError(
                        'Could not found the OLD parent by id {' + oldData.parentId + '}');
                    oldParent.children = (oldParent.children || []);
                    let otherChilds: IWarehouseCategory[];
                    otherChilds = oldParent.children.filter(oldChild => {
                        return (oldChild.id !== oldData.id);
                    });
                    oldParent.children = (otherChilds || []);
                    if (!(newData.parentId || '').length) {
                        return this.getDbService().update(oldParent).then(() => {
                            delete newData['uid'];
                            return this.getDbService().insert(newData).then(() => {
                                this.refresh();
                                return oldData;
                            });
                        });

                    } else {
                        return this.getDbService().findById(newData.parentId)
                            .then(newParent => {
                                !newParent || throwError(
                                    'Could not found the NEW parent by id {' + newData.parentId + '}');
                                newParent.children = (newParent.children || []);
                                let newChild: IWarehouseCategory;
                                newChild = ObjectUtils.deepCopy(newData);
                                delete newChild['uid'];
                                newParent.children.push(newChild);
                                return this.getDbService().update(newParent).then(() => {
                                    return this.getDbService().update(oldParent).then(() => {
                                        return this.getDbService().deletePernament(newData).then(() => {
                                            this.refresh();
                                            return oldData;
                                        });
                                    });
                                });
                            });
                    }
                });
        }

    }

    /**
     * Remove the specified data
     * @param data to remove
     * @return effected records number
     */
    remove(data: IWarehouseCategory): Promise<number> {
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

    prepend(data: IWarehouseCategory): Promise<number> {
        return this.append(data);
    }

    append(data: IWarehouseCategory): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

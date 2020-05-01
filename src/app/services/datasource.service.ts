import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {IDbService, IHttpService} from './interface.service';
import {throwError} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../config/log.config';
import {LocalPager} from 'ng2-smart-table/lib/data-source/local/local.pager';
import {LocalFilter} from 'ng2-smart-table/lib/data-source/local/local.filter';
import {LocalSorter} from 'ng2-smart-table/lib/data-source/local/local.sorter';

/**
 * Abstract data source for table service
 * @param <T> IndexDb entity type
 * @param <H> HTTP service type
 * @param <D> IndexDb service type
 */
export abstract class AbstractDataSource<T, H extends IHttpService<T>, D extends IDbService<T>> extends DataSource {

    private filterCfg: any = {
        filters: [],
        andOperator: true,
    };
    private pagingCfg: any = {page: 1};
    private sortCfg: Array<any> = [];

    protected getHttpService(): H {
        return this.httpService;
    }

    protected getDbService(): D {
        return this.dbService;
    }

    public get databaseService(): IDbService<T> {
        return this.getDbService();
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected constructor(private httpService: H,
                          private dbService: D,
                          @Inject(NGXLogger) private logger: NGXLogger) {
        super();
        httpService || throwError('Not found HTTP service');
        dbService || throwError('Not found database service');
        logger || throwError('Could not inject logger!');
        logger.updateConfig(LogConfig);
    }

    reset(silent = false): void {
        if (silent) {
            this.filterCfg = {
                filters: [],
                andOperator: true,
            };
            this.sortCfg = [];
            this.pagingCfg['page'] = 1;
        } else {
            this.setFilter([], true, false);
            this.setSort([], false);
            this.setPage(1);
        }
    }

    getFilter(): any {
        // TODO Implement by children class, please returning not undefined
        return this.filterCfg;
    }

    /**
     *
     * Array of conf objects
     * [{field: string, search: string, filter: Function|null},]
     * @param conf
     * @param andOperator
     * @param doEmit
     * @returns {AbstractDataSource}
     */
    setFilter(conf: Array<any>, andOperator?: boolean, doEmit?: boolean): AbstractDataSource<T, H, D> {
        if (conf && conf.length > 0) {
            conf.forEach((fieldConf) => {
                this.addFilter(fieldConf, andOperator, false);
            });

        } else {
            this.filterCfg = {
                filters: [],
                andOperator: true,
            };
        }
        this.filterCfg.andOperator = andOperator;
        this.pagingCfg['page'] = 1;

        super.setFilter(conf, andOperator, doEmit);
        return this;
    }

    addFilter(fieldConf: any, andOperator = true, doEmit: boolean = true): AbstractDataSource<T, H, D> {
        if (!fieldConf['field'] || typeof fieldConf['search'] === 'undefined') {
            throwError('Filter configuration object is not valid');
        }

        let found = false;
        this.filterCfg.filters.forEach((currentFieldConf: any, index: any) => {
            if (currentFieldConf['field'] === fieldConf['field']) {
                this.filterCfg.filters[index] = fieldConf;
                found = true;
            }
        });
        if (!found) {
            this.filterCfg.filters.push(fieldConf);
        }
        this.filterCfg.andOperator = andOperator;
        super.addFilter(fieldConf, andOperator, doEmit);
        return this;
    }

    getSort(): any {
        // TODO Implement by children class, please returning not undefined
        return this.sortCfg;
    }

    /**
     *
     * Array of conf objects
     * [{field: string, direction: asc|desc|null, compare: Function|null},]
     * @param conf
     * @param doEmit
     * @returns {AbstractDataSource}
     */
    setSort(conf: Array<any>, doEmit = true): AbstractDataSource<T, H, D> {
        if (conf !== null) {
            conf.forEach((fieldConf) => {
                if (!fieldConf['field'] || typeof fieldConf['direction'] === 'undefined') {
                    throwError('Sort configuration object is not valid');
                }
            });
            this.sortCfg = conf;
        }

        super.setSort(conf, doEmit);
        return this;
    }

    getPaging(): any {
        // TODO Implement by children class, please returning not undefined
        return this.pagingCfg;
    }

    setPaging(page: number, perPage: number, doEmit?: boolean): AbstractDataSource<T, H, D> {
        this.pagingCfg['page'] = page;
        this.pagingCfg['perPage'] = perPage;
        super.setPaging(page, perPage, doEmit);
        return this;
    }

    setPage(page: number, doEmit?: boolean): void {
        this.pagingCfg['page'] = page;
        if (!doEmit) {
            doEmit = (((this.pagingCfg['perPage'] as number) || 0) > 0);
        }
        super.setPage(page, doEmit || false);
    }

    protected prepareData(data: Array<T>): Array<T> {
        data = this.filter(data);
        data = this.sort(data);
        return this.paginate(data);
    }

    protected sort(data: Array<T>): Array<T> {
        if (this.sortCfg) {
            this.sortCfg.forEach((fieldConf) => {
                data = LocalSorter.sort(data,
                    fieldConf['field'], fieldConf['direction'], fieldConf['compare']);
            });
        }
        return data;
    }

    // TODO: refactor?
    protected filter(data: Array<T>): Array<T> {
        if (this.filterCfg.filters) {
            if (this.filterCfg.andOperator) {
                this.filterCfg.filters.forEach((fieldConf: any) => {
                    if ((fieldConf['search'] || '').length) {
                        data = LocalFilter.filter(data,
                            fieldConf['field'], fieldConf['search'], fieldConf['filter']);
                    }
                });

            } else if (this.filterCfg.filters.length) {
                let mergedData: any = [];
                this.filterCfg.filters.forEach((fieldConf: any) => {
                    if ((fieldConf['search'] || '').length) {
                        mergedData = mergedData.concat(LocalFilter.filter(
                            data, fieldConf['field'], fieldConf['search'], fieldConf['filter']));
                    }
                });
                // remove non unique items
                data = mergedData.filter((elem: any, pos: any, arr: any) => {
                    return arr.indexOf(elem) === pos;
                });
            }
        }
        return data;
    }

    protected paginate(data: Array<T>): Array<T> {
        if (this.pagingCfg && this.pagingCfg['page'] && this.pagingCfg['perPage']) {
            data = LocalPager.paginate(data, this.pagingCfg['page'], this.pagingCfg['perPage']);
        }
        return data;
    }
}

/**
 * Abstract base data source for table service
 * @param <T> IndexDb entity type
 * @param <H> HTTP service type
 * @param <D> IndexDb service type
 */
export abstract class BaseDataSource<T, H extends IHttpService<T>, D extends IDbService<T>>
    extends AbstractDataSource<T, H, D> {

    private latestCount: number = 0;

    protected constructor(httpService: H, dbService: D,
                          @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<T | T[]> {
        return super.getDbService().getAll()
            .then(this.onFulfilledData(), reason => {
                this.getLogger().error(reason);
                return [];
            }).catch(reason => {
                this.getLogger().error(reason);
                return [];
            });
    }

    getAllByIndex(indexName: string, keyRange: IDBKeyRange): Promise<T | T[]> {
        return super.getDbService().getAllByIndex(indexName, keyRange)
            .then(this.onFulfilledData(), reason => {
                this.getLogger().error(reason);
                return [];
            }).catch(reason => {
                this.getLogger().error(reason);
                return [];
            });
    }

    protected onFulfilledData():
        ((value: T | T[] | any) => (T | T[] | any) | PromiseLike<T | T[] | any>) | undefined | null {
        const _this: BaseDataSource<T, H, D> = this;
        return (data: T[]) => {
            data = _this.filter(data);
            data = _this.sort(data);
            _this.setRecordsNumber((data || []).length);
            data = _this.paginate(data);
            return data;
        };
    }

    protected setRecordsNumber(recNumber?: number | 0): void {
        this.latestCount = recNumber || 0;
    }

    getElements(): Promise<T | T[]> {
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
    update(oldData: T, newData: T): Promise<T> {
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
    remove(data: T): Promise<number> {
        return this.getDbService().delete(data).then(() => {
            this.refresh();
            return 1;
        });
    }

    refresh(): void {
        this.getLogger().debug('Refresh data source');
        super.refresh();
    }

    load(data: Array<T> | T[]): Promise<any> {
        this.getLogger().debug('Load data', data);
        return super.load(data);
    }

    prepend(data: T): Promise<number> {
        return this.append(data);
    }

    append(data: T): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

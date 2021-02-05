import {DataSource} from '@app/types/index';
import {IDbService, IHttpService} from './interface.service';
import {Inject} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../config/log.config';
import AssertUtils from '@app/utils/common/assert.utils';

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
        AssertUtils.isValueNotNou(httpService, 'Not found HTTP service');
        AssertUtils.isValueNotNou(dbService, 'Not found database service');
        AssertUtils.isValueNotNou(logger, 'Could not inject logger!');
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
            throw new Error('Filter configuration object is not valid');
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
                    throw new Error('Sort configuration object is not valid');
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
                // data = LocalSorter.sort(data,
                //     fieldConf['field'], fieldConf['direction'], fieldConf['compare']);

                const direction: number = (fieldConf['direction'] === 'asc') ? 1 : -1;
                const compareDelegateFnc: Function = typeof fieldConf['compare'] === 'function'
                    ? <Function>fieldConf['compare'] : (d1: any, d2: any) => {
                    const df1: any = (d1[fieldConf['field']] || d1);
                    const df2: any = (d2[fieldConf['field']] || d2);
                    return (df1 < df2 ? -1 * direction : df1 > df2 ? direction : 0);
                };
                data = data.sort((d1: any, d2: any) => {
                    return compareDelegateFnc.apply(this, [d1, d2]);
                });
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
                        const filterDelegateFnc: Function = typeof fieldConf['filter'] === 'function'
                            ? fieldConf['filter'] : (value: any) => {
                                const strValue: any = (value[fieldConf['field']] || value || '');
                                const strSearch: any = (fieldConf['search'] || '');
                                return strValue.toString().toLowerCase().includes(strSearch.toString().toLowerCase());
                            };
                        return data.filter((value: any) => filterDelegateFnc.apply(this, [value]));
                    }
                });

            } else if (this.filterCfg.filters.length) {
                let mergedData: any = [];
                this.filterCfg.filters.forEach((fieldConf: any) => {
                    if ((fieldConf['search'] || '').length) {
                        const filterDelegateFnc: Function = typeof fieldConf['filter'] === 'function'
                            ? fieldConf['filter'] : (value: any) => {
                                const strValue: any = (value[fieldConf['field']] || value || '');
                                const strSearch: any = (fieldConf['search'] || '');
                                return strValue.toString().toLowerCase().includes(strSearch.toString().toLowerCase());
                            };
                        mergedData = mergedData.concat(data.filter((value: any) => filterDelegateFnc.apply(this, [value])));
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
            data = data.slice(this.pagingCfg['perPage'] * (this.pagingCfg['page'] - 1), this.pagingCfg['perPage'] * this.pagingCfg['page']);
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

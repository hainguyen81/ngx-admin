import {Inject, Injectable} from '@angular/core';
import {CustomerDbService, CustomerHttpService} from './customer.service';
import {AbstractDataSource} from '../../../datasource.service';
import {ICustomer} from '../../../../@core/data/system/customer';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class CustomerDatasource extends AbstractDataSource<ICustomer, CustomerHttpService, CustomerDbService> {

    private latestCount: number = 0;

    constructor(@Inject(CustomerHttpService) httpService: CustomerHttpService,
                @Inject(CustomerDbService) dbService: CustomerDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }

    getAll(): Promise<ICustomer | ICustomer[]> {
        return super.getDbService().getAll().then((customers: ICustomer[]) => {
            customers = this.filter(customers);
            customers = this.sort(customers);
            this.latestCount = (customers || []).length;
            customers = this.paginate(customers);
            return customers;
        });
    }

    getElements(): Promise<ICustomer | ICustomer[]> {
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
    update(oldData: ICustomer, newData: ICustomer): Promise<ICustomer> {
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
    remove(data: ICustomer): Promise<number> {
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

    prepend(data: ICustomer): Promise<number> {
        return this.append(data);
    }

    append(data: ICustomer): Promise<any> {
        this.getLogger().debug('New data', data);
        return this.getDbService().insert(data).then(() => {
            this.refresh();
            return 1;
        });
    }
}

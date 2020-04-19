import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IOrganization} from '../../../../@core/data/system/organization';
import {OrganizationDbService, OrganizationHttpService} from './organization.service';

@Injectable()
export class OrganizationDataSource
    extends BaseDataSource<IOrganization, OrganizationHttpService, OrganizationDbService> {

    constructor(@Inject(OrganizationHttpService) httpService: OrganizationHttpService,
                @Inject(OrganizationDbService) dbService: OrganizationDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
        super.setSort([{field: 'uid', direction: 'desc'}]);
    }
}

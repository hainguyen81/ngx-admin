import {Inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../../config/log.config';
import {OrganizationDbService} from '../../../services/implementation/system/organization/organization.service';
import {IOrganization} from '../../data/system/organization';
import {organizationGenerate} from './mock.organization';

@Injectable()
export class MockOrganizationService {

    constructor(@Inject(OrganizationDbService) private dbService: OrganizationDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        dbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): void {
        if (environment.production) {
            return;
        }

        // just generate mock data if empty
        this.dbService.count().then((recNumber: number) => {
            if (recNumber <= 0) {
                // generate mock data
                let mockOrganization: IOrganization[];
                mockOrganization = organizationGenerate();
                this.logger.debug('Generate organization', mockOrganization);
                this.dbService.insertEntities(mockOrganization)
                    .then((affected: number) => this.logger.debug('Initialized mock organization data', affected),
                        (errors) => this.logger.error('Could not initialize mock organization data', errors));
            } else {
                this.logger.debug('Initialized mock organization data', recNumber);
            }
        });
    }
}

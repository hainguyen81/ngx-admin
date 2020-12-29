import {Inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../../config/log.config';
import {GeneralSettingsDbService} from '../../../services/implementation/system/general.settings/general.settings.service';
import {IGeneralSettings} from '../../data/system/general.settings';
import {generalSettingsGenerate} from './mock.general.settings';
import {IMockService} from '../mock.service';
import {AppConfig} from '../../../config/app.config';

@Injectable({ providedIn: 'any' })
export class MockGeneralSettingsService implements IMockService {

    constructor(@Inject(GeneralSettingsDbService) private dbService: GeneralSettingsDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        dbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): Promise<any> {
        if (!AppConfig.Env.mock) {
            return Promise.resolve();
        }

        // just generate mock data if empty
        return this.dbService.count().then((recNumber: number) => {
            if (recNumber <= 0) {
                let mockSettings: IGeneralSettings[];
                mockSettings = generalSettingsGenerate();
                this.logger.debug('Generate settings', mockSettings);
                this.dbService.insertEntities(mockSettings)
                    .then((affected: number) => this.logger.debug('Initialized mock settings data', affected),
                        (errors) => this.logger.error('Could not initialize mock settings data', errors));
            } else {
                this.logger.debug('Initialized mock settings data', recNumber);
            }
        });
    }
}

import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../../config/log.config';
import {CountryDbService} from '../../../services/implementation/system/country/country.service';
import {countriesGenerate} from './mock.country';
import {ICountry} from '../../data/system/country';
import {IMockService} from '../mock.service';
import {AppConfig} from '../../../config/app.config';
import AssertUtils from '@app/utils/common/assert.utils';

@Injectable()
export class MockCountryService implements IMockService {

    constructor(@Inject(CountryDbService) private dbService: CountryDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        AssertUtils.isValueNotNou(dbService, 'Could not inject user database service');
        AssertUtils.isValueNotNou(logger, 'Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): Promise<any> {
        if (!AppConfig.Env.mock) {
            return Promise.resolve();
        }

        // just generate mock data if empty
        return this.dbService.count().then((recNumber: number) => {
            if (recNumber <= 0) {
                let mockCountries: ICountry[];
                mockCountries = countriesGenerate();
                this.logger.debug('Generate countries', mockCountries);
                this.dbService.insertEntities(mockCountries)
                    .then((affected: number) => this.logger.debug('Initialized mock countries data', affected),
                        (errors) => this.logger.error('Could not initialize mock countries data', errors));
            } else {
                this.logger.debug('Initialized mock countries data', recNumber);
            }
        });
    }
}

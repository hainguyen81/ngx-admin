import {Inject, Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../../config/log.config';
import {CountryDbService} from '../../../services/implementation/system/country/country.service';
import {countriesGenerate} from './mock.country';
import {ICountry} from '../../data/system/country';
import {IMockService} from '../mock.service';

@Injectable()
export class MockCountryService implements IMockService {

    constructor(@Inject(CountryDbService) private dbService: CountryDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        dbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): Promise<any> {
        if (environment.production) {
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

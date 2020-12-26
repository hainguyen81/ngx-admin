import {Inject, Injectable} from '@angular/core';
import {BaseDataSource} from '../../../common/datasource.service';
import {NGXLogger} from 'ngx-logger';
import {IGeneralSettings} from '../../../../@core/data/system/general.settings';
import {GeneralSettingsDbService, GeneralSettingsHttpService} from './general.settings.service';

@Injectable()
export class GeneralSettingsDatasource
    extends BaseDataSource<IGeneralSettings, GeneralSettingsHttpService, GeneralSettingsDbService> {

    constructor(@Inject(GeneralSettingsHttpService) httpService: GeneralSettingsHttpService,
                @Inject(GeneralSettingsDbService) dbService: GeneralSettingsDbService,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(httpService, dbService, logger);
    }
}

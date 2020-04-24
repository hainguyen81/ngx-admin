import ObjectUtils from '../../../utils/object.utils';
import {IdGenerators} from '../../../config/generator.config';
import {IGeneralSettings} from '../../data/system/general.settings';
import {MockModuleSystem} from './mock.module';

export const MockGeneralSettingsTemplate: IGeneralSettings = {
    id: null,
    builtin: true,
    code: 'STATUS',
    name: 'Status',
    value: 'STATUS',
    module_id: MockModuleSystem.id,
    module: MockModuleSystem,
};

export function generalSettingsGenerate(): IGeneralSettings[] {
    let mockSettings: IGeneralSettings[];
    mockSettings = [];
    let mockSetting: IGeneralSettings;
    mockSetting = ObjectUtils.deepCopy(MockGeneralSettingsTemplate);
    mockSetting.id = IdGenerators.oid.generate();
    mockSettings.push(mockSetting);
    return mockSettings;
}

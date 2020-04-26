import ObjectUtils from '../../../utils/object.utils';
import {IdGenerators} from '../../../config/generator.config';
import GeneralSettings, {IGeneralSettings} from '../../data/system/general.settings';
import {MockModuleSystem} from './mock.module';
import {Constants as CommonConstants} from '../../data/constants/common.constants';
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import {Constants as CustomerConstants} from '../../data/constants/customer.constants';
import CUSTOMER_STATUS = CustomerConstants.CustomerConstants.CUSTOMER_STATUS;
import CUSTOMER_LEVEL = CustomerConstants.CustomerConstants.CUSTOMER_LEVEL;
import CUSTOMER_TYPE = CustomerConstants.CustomerConstants.CUSTOMER_TYPE;
import {Constants as OrganizationConstants} from '../../data/constants/organization.constants';
import ORGANIZATION_TYPE = OrganizationConstants.OrganizationConstants.ORGANIZATION_TYPE;
import {Constants as UserConstants} from '../../data/constants/user.constants';
import USER_STATUS = UserConstants.UserConstants.USER_STATUS;
import {Constants as WarehouseConstants} from '../../data/constants/warehouse.category.constants';
import CATEGORY_TYPE = WarehouseConstants.WarehouseConstants.WarehouseCategoryConstants.CATEGORY_TYPE;
import CATEGORY_STATUS = WarehouseConstants.WarehouseConstants.WarehouseCategoryConstants.CATEGORY_STATUS;

export const MockGeneralSettingsTemplate: IGeneralSettings = {
    id: null,
    builtin: true,
    code: 'STATUS',
    name: 'Status',
    value: 'STATUS',
    module_id: null,
    module_code: null,
    module: null,
};

export function generalCustomerSystemSettingsGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // CUSTOMER_STATUS
    // -------------------------------------------------
    Object.keys(CUSTOMER_STATUS).forEach(k => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.CUSTOMER_STATUS.code;
        systemSetting.name = k;
        systemSetting.value = CUSTOMER_STATUS[k];
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    // -------------------------------------------------
    // CUSTOMER_LEVEL
    // -------------------------------------------------
    Object.keys(CUSTOMER_LEVEL).forEach(k => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.CUSTOMER_LEVEL.code;
        systemSetting.name = k;
        systemSetting.value = CUSTOMER_LEVEL[k];
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    // -------------------------------------------------
    // CUSTOMER_LEVEL
    // -------------------------------------------------
    Object.keys(CUSTOMER_TYPE).forEach(k => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.CUSTOMER_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = CUSTOMER_TYPE[k];
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });
    return systemSettings;
}

export function generalOrganizationSystemSettingsGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // ORGANIZATION_TYPE
    // -------------------------------------------------
    Object.keys(ORGANIZATION_TYPE).forEach(k => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.ORGANIZATION_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = ORGANIZATION_TYPE[k];
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalUserSystemSettingsGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // USER_STATUS
    // -------------------------------------------------
    Object.keys(USER_STATUS).forEach(k => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.USER_STATUS.code;
        systemSetting.name = k;
        systemSetting.value = USER_STATUS[k];
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalWarehouseCategorySystemSettingsGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // CATEGORY_TYPE
    // -------------------------------------------------
    Object.keys(CATEGORY_TYPE).forEach(k => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.WAREHOUSE_CATEGORY_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = CATEGORY_TYPE[k];
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    // -------------------------------------------------
    // CATEGORY_STATUS
    // -------------------------------------------------
    Object.keys(CATEGORY_STATUS).forEach(k => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.WAREHOUSE_CATEGORY_STATUS.code;
        systemSetting.name = k;
        systemSetting.value = CATEGORY_STATUS[k];
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalSettingsGenerate(): IGeneralSettings[] {
    let mockSettings: IGeneralSettings[];
    mockSettings = [];
    // demo
    let mockSetting: IGeneralSettings;
    mockSetting = ObjectUtils.deepCopy(MockGeneralSettingsTemplate);
    mockSetting.id = IdGenerators.oid.generate();
    mockSetting.module_id = MockModuleSystem.id;
    mockSetting.module_code = MockModuleSystem.code;
    mockSetting.module = MockModuleSystem;
    mockSettings.push(mockSetting);

    // Customer
    mockSettings = mockSettings.concat(generalCustomerSystemSettingsGenerate());

    // Organization
    mockSettings = mockSettings.concat(generalOrganizationSystemSettingsGenerate());

    // User
    mockSettings = mockSettings.concat(generalUserSystemSettingsGenerate());

    // Warehouse
    mockSettings = mockSettings.concat(generalWarehouseCategorySystemSettingsGenerate());

    return mockSettings;
}

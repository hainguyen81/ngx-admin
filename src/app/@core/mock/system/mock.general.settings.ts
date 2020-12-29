import {IdGenerators} from '../../../config/generator.config';
import GeneralSettings, {IGeneralSettings} from '../../data/system/general.settings';
import {MockModuleSystem, MockModuleWarehouse} from './mock.module';
import {Constants as CommonConstants} from '../../data/constants/common.constants';
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import STATUS = CommonConstants.COMMON.STATUS;
import CURRENCY = CommonConstants.COMMON.CURRENCY;
import {Constants as CustomerConstants} from '../../data/constants/customer.constants';
import CUSTOMER_LEVEL = CustomerConstants.CustomerConstants.CUSTOMER_LEVEL;
import CUSTOMER_TYPE = CustomerConstants.CustomerConstants.CUSTOMER_TYPE;
import {Constants as OrganizationConstants} from '../../data/constants/organization.constants';
import ORGANIZATION_TYPE = OrganizationConstants.OrganizationConstants.ORGANIZATION_TYPE;
import {Constants as WarehouseConstants} from '../../data/constants/warehouse.category.constants';
import CATEGORY_TYPE = WarehouseConstants.WarehouseConstants.WarehouseCategoryConstants.CATEGORY_TYPE;
import {Constants as WarehouseSettingsConstants} from '../../data/constants/warehouse.settings.constants';
import WAREHOUSE_SETTINGS_TYPE = WarehouseSettingsConstants.WarehouseSettingsConstants.WAREHOUSE_SETTINGS_TYPE;
import {Constants as WarehouseInventoryConstants} from '../../data/constants/warehouse.inventory.constants';
import WAREHOUSE_INVENTORY_TYPE = WarehouseInventoryConstants.WarehouseConstants
    .WarehouseInventoryConstants.WAREHOUSE_INVENTORY_TYPE;
import WAREHOUSE_INVENTORY_STATUS = WarehouseInventoryConstants.WarehouseConstants
    .WarehouseInventoryConstants.WAREHOUSE_INVENTORY_STATUS;
import {Constants as WarehouseStorageConstants} from '../../data/constants/warehouse.storage.constants';
import STORAGE_TYPE = WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE;

export function generalSystemSettingsStatusGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------
    Object.entries(STATUS).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.STATUS.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalSystemSettingsCustomerGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // CUSTOMER_LEVEL
    // -------------------------------------------------
    Object.entries(CUSTOMER_LEVEL).forEach(([k , v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.CUSTOMER_LEVEL.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    // -------------------------------------------------
    // CUSTOMER_LEVEL
    // -------------------------------------------------
    Object.entries(CUSTOMER_TYPE).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.CUSTOMER_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });
    return systemSettings;
}

export function generalSystemSettingsOrganizationGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // ORGANIZATION_TYPE
    // -------------------------------------------------
    Object.entries(ORGANIZATION_TYPE).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.ORGANIZATION_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalSystemSettingsCurrencyGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // CURRENCY
    // -------------------------------------------------
    Object.entries(CURRENCY).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.CURRENCY.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleSystem.id;
        systemSetting.module_code = MockModuleSystem.code;
        systemSetting.module = MockModuleSystem;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalWarehouseSettingsSettingsTypeGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // WAREHOUSE_SETTINGS_TYPE
    // -------------------------------------------------
    Object.entries(WAREHOUSE_SETTINGS_TYPE).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.WAREHOUSE_SETTINGS_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleWarehouse.id;
        systemSetting.module_code = MockModuleWarehouse.code;
        systemSetting.module = MockModuleWarehouse;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalWarehouseSettingsCategoryGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // CATEGORY_TYPE
    // -------------------------------------------------
    Object.entries(CATEGORY_TYPE).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.WAREHOUSE_CATEGORY_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleWarehouse.id;
        systemSetting.module_code = MockModuleWarehouse.code;
        systemSetting.module = MockModuleWarehouse;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalWarehouseSettingsStorageGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // STORAGE_TYPE
    // -------------------------------------------------
    Object.entries(STORAGE_TYPE).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.WAREHOUSE_STORAGE_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleWarehouse.id;
        systemSetting.module_code = MockModuleWarehouse.code;
        systemSetting.module = MockModuleWarehouse;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalWarehouseSettingsInventoryGenerate(): IGeneralSettings[] {
    let systemSettings: IGeneralSettings[];
    let systemSetting: IGeneralSettings;
    systemSettings = [];

    // -------------------------------------------------
    // WAREHOUSE_SETTINGS_TYPE
    // -------------------------------------------------
    Object.entries(WAREHOUSE_INVENTORY_TYPE).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.WAREHOUSE_INVENTORY_TYPE.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleWarehouse.id;
        systemSetting.module_code = MockModuleWarehouse.code;
        systemSetting.module = MockModuleWarehouse;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    // -------------------------------------------------
    // WAREHOUSE_INVENTORY_STATUS
    // -------------------------------------------------
    Object.entries(WAREHOUSE_INVENTORY_STATUS).forEach(([k, v]) => {
        systemSetting = new GeneralSettings(null, null, null, null);
        systemSetting.id = IdGenerators.oid.generate();
        systemSetting.code = BUILTIN_CODES.WAREHOUSE_INVENTORY_STATUS.code;
        systemSetting.name = k;
        systemSetting.value = v;
        systemSetting.module_id = MockModuleWarehouse.id;
        systemSetting.module_code = MockModuleWarehouse.code;
        systemSetting.module = MockModuleWarehouse;
        systemSetting.builtin = true;
        systemSettings.push(systemSetting);
    });

    return systemSettings;
}

export function generalSettingsGenerate(): IGeneralSettings[] {
    let mockSettings: IGeneralSettings[];
    mockSettings = [];

    // Common
    mockSettings = mockSettings.concat(generalSystemSettingsStatusGenerate());
    mockSettings = mockSettings.concat(generalSystemSettingsCurrencyGenerate());

    // Customer
    mockSettings = mockSettings.concat(generalSystemSettingsCustomerGenerate());

    // Organization
    mockSettings = mockSettings.concat(generalSystemSettingsOrganizationGenerate());

    // Warehouse category
    mockSettings = mockSettings.concat(generalWarehouseSettingsCategoryGenerate());

    // Warehouse settings
    mockSettings = mockSettings.concat(generalWarehouseSettingsSettingsTypeGenerate());

    // Warehouse inventory
    mockSettings = mockSettings.concat(generalWarehouseSettingsInventoryGenerate());

    // Warehouse storage
    mockSettings = mockSettings.concat(generalWarehouseSettingsStorageGenerate());

    return mockSettings;
}

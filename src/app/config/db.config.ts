import {DBConfig} from 'ngx-indexed-db';
import {environment} from '../../environments/environment';

export const DB_STORE: any = {
    version: 1,

    // System modules
    third_party: 'third_party',
    auth: 'auth',
    module: 'module',
    user: 'user',
    customer: 'customer',
    country: 'country',
    city: 'city',
    province: 'province',
    organization: 'organization',
    general_settings: 'general_settings',

    // Warehouse modules
    warehouse: 'warehouse',
    warehouse_item: 'warehouse_item',
    warehouse_order: 'warehouse_order',
    warehouse_order_detail: 'warehouse_order_detail',
    warehouse_inventory: 'warehouse_inventory',
    warehouse_inventory_detail: 'warehouse_inventory_detail',
    warehouse_category: 'warehouse_category',
    warehouse_adjust: 'warehouse_adjust',
    warehouse_adjust_detail: 'warehouse_adjust_detail',
    warehouse_settings: 'warehouse_settings',
    warehouse_batch_no: 'warehouse_batch_no',
    warehouse_management: 'warehouse_management',
};

// Ahead of time compiles requires an exported function for factories
export function indexFactory() {
    // The animal table was added with version 2 but none of the existing tables or data needed
    // to be modified so a migrator for that version is not included.
    return {
        1: (db, transaction) => {
            // customer
            const customerStore = transaction.objectStore(DB_STORE.customer);
            customerStore.createIndex(
                '__customer_index_by_type_code',
                ['type', 'code'],
                { unique: true });
            customerStore.createIndex(
                '__customer_index_by_type',
                ['type'],
                { unique: false });

            // general settings
            const generalSettingsStore = transaction.objectStore(DB_STORE.general_settings);
            generalSettingsStore.createIndex(
                '__general_settings_index_by_id',
                ['id', 'module_id', 'code'],
                { unique: true });
            generalSettingsStore.createIndex(
                '__general_settings_index_by_code',
                ['id', 'module_code', 'code'],
                { unique: true });
            generalSettingsStore.createIndex(
                '__general_settings_index_by_module_code',
                ['module_code', 'code'],
                { unique: false });

            // warehouse_item
            const warehouseItemStore = transaction.objectStore(DB_STORE.warehouse_item);
            warehouseItemStore.createIndex(
                '__warehouse_item_index_by_id',
                ['id', 'item_id'],
                { unique: true });
            warehouseItemStore.createIndex(
                '__warehouse_item_index_by_code',
                ['code', 'item_code'],
                { unique: true });

            // warehouse_inventory_detail
            const warehouseInvDetailStore = transaction.objectStore(DB_STORE.warehouse_inventory_detail);
            warehouseInvDetailStore.createIndex(
                '__warehouse_inv_detail_index_by_id',
                ['id', 'inventory_id'],
                { unique: true });
            warehouseInvDetailStore.createIndex(
                '__warehouse_inv_detail_index_by_inventory_id',
                ['inventory_id'],
                { unique: false });
            warehouseInvDetailStore.createIndex(
                '__warehouse_inv_detail_index_by_inventory_code',
                ['inventory_code'],
                { unique: false });

            // warehouse_management
            const warehouseManagementStore = transaction.objectStore(DB_STORE.warehouse_management);
            warehouseManagementStore.createIndex(
                '__whman_index_by_id',
                ['warehouse_id', 'item_id', 'object_id'],
                { unique: true });
            warehouseManagementStore.createIndex(
                '__whman_index_by_code',
                ['warehouse_code', 'item_code'],
                { unique: false });
            warehouseManagementStore.createIndex(
                '__whman_object_item_index_by_code',
                ['warehouse_code', 'object_code', 'item_code'],
                { unique: false });
            warehouseManagementStore.createIndex(
                '__whman_object_index_by_code',
                ['warehouse_code', 'object_code'],
                { unique: false });
        },
    };
}

export const dbConfig: DBConfig = {
    name: environment.databaseName,
    version: DB_STORE.version,
    objectStoresMeta: [{
        store: DB_STORE.third_party,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'response', keypath: 'response', options: {unique: false}},
            {name: 'expiredAt', keypath: 'expiredAt', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.general_settings,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: false}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'value', keypath: 'value', options: {unique: false}},
            {name: 'builtin', keypath: 'builtin', options: {unique: false}},
            {name: 'module_id', keypath: 'module_id', options: {unique: false}},
            {name: 'module_code', keypath: 'module_code', options: {unique: false}},
            {name: 'module', keypath: 'module', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.auth,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'access_token', keypath: 'access_token', options: {unique: true}},
            {name: 'token_type', keypath: 'token_type', options: {unique: false}},
            {name: 'refresh_token', keypath: 'refresh_token', options: {unique: true}},
            {name: 'expires_in', keypath: 'expires_in', options: {unique: false}},
            {name: 'scope', keypath: 'scope', options: {unique: false}},
            {name: 'company', keypath: 'company', options: {unique: false}},
            {name: 'enterprise', keypath: 'enterprise', options: {unique: false}},
            {name: 'username', keypath: 'username', options: {unique: false}},
            {name: 'firstName', keypath: 'firstName', options: {unique: false}},
            {name: 'lastName', keypath: 'lastName', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: false}},
            {name: 'image', keypath: 'image', options: {unique: false}},
            {name: 'status', keypath: 'status', options: {unique: false}},
            {name: 'rolesGroupId', keypath: 'rolesGroupId', options: {unique: false}},
            {name: 'rolesGroup', keypath: 'rolesGroup', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.module,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'apiId', keypath: 'apiId', options: {unique: true}},
            {name: 'api', keypath: 'api', options: {unique: false}},
            {name: 'children', keypath: 'children', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.user,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'scope', keypath: 'scope', options: {unique: false}},
            {name: 'company', keypath: 'company', options: {unique: false}},
            {name: 'enterprise', keypath: 'enterprise', options: {unique: false}},
            {name: 'username', keypath: 'username', options: {unique: true}},
            {name: 'password', keypath: 'password', options: {unique: false}},
            {name: 'firstName', keypath: 'firstName', options: {unique: false}},
            {name: 'lastName', keypath: 'lastName', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: true}},
            {name: 'image', keypath: 'image', options: {unique: true}},
            {name: 'status', keypath: 'status', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.customer,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'status', keypath: 'status', options: {unique: false}},
            {name: 'level', keypath: 'level', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: true}},
            {name: 'tel', keypath: 'tel', options: {unique: false}},
            {name: 'fax', keypath: 'fax', options: {unique: false}},
            {name: 'website', keypath: 'website', options: {unique: false}},
            {name: 'address', keypath: 'address', options: {unique: false}},
            {name: 'district_id', keypath: 'district_id', options: {unique: false}},
            {name: 'district', keypath: 'district', options: {unique: false}},
            {name: 'city_id', keypath: 'city_id', options: {unique: false}},
            {name: 'city', keypath: 'city', options: {unique: false}},
            {name: 'province_id', keypath: 'province_id', options: {unique: false}},
            {name: 'province', keypath: 'province', options: {unique: false}},
            {name: 'zip_code', keypath: 'zip_code', options: {unique: false}},
            {name: 'country_id', keypath: 'country_id', options: {unique: false}},
            {name: 'country', keypath: 'country', options: {unique: false}},
            {name: 'contact_name', keypath: 'contact_name', options: {unique: false}},
            {name: 'contact_tel', keypath: 'contact_tel', options: {unique: false}},
            {name: 'contact_fax', keypath: 'contact_fax', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.organization,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'parentId', keypath: 'parentId', options: {unique: false}},
            {name: 'parent', keypath: 'parent', options: {unique: false}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'tax', keypath: 'tax', options: {unique: false}},
            {name: 'address', keypath: 'address', options: {unique: false}},
            {name: 'district_id', keypath: 'district_id', options: {unique: false}},
            {name: 'district', keypath: 'district', options: {unique: false}},
            {name: 'city_id', keypath: 'city_id', options: {unique: false}},
            {name: 'city', keypath: 'city', options: {unique: false}},
            {name: 'province_id', keypath: 'province_id', options: {unique: false}},
            {name: 'province', keypath: 'province', options: {unique: false}},
            {name: 'zip_code', keypath: 'zip_code', options: {unique: false}},
            {name: 'country_id', keypath: 'country_id', options: {unique: false}},
            {name: 'country', keypath: 'country', options: {unique: false}},
            {name: 'tel', keypath: 'tel', options: {unique: false}},
            {name: 'fax', keypath: 'fax', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
            {name: 'managerId', keypath: 'managerId', options: {unique: false}},
            {name: 'manager', keypath: 'manager', options: {unique: false}},
            {name: 'contact', keypath: 'contact', options: {unique: false}},
            {name: 'image', keypath: 'image', options: {unique: false}},
            {name: 'children', keypath: 'children', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'street_address', keypath: 'street_address', options: {unique: false}},
            {name: 'district_id', keypath: 'district_id', options: {unique: false}},
            {name: 'district', keypath: 'district', options: {unique: false}},
            {name: 'city_id', keypath: 'city_id', options: {unique: false}},
            {name: 'city', keypath: 'city', options: {unique: false}},
            {name: 'province_id', keypath: 'province_id', options: {unique: false}},
            {name: 'province', keypath: 'province', options: {unique: false}},
            {name: 'country_id', keypath: 'country_id', options: {unique: false}},
            {name: 'country', keypath: 'country', options: {unique: false}},
            {name: 'zip_code', keypath: 'zip_code', options: {unique: false}},
            {name: 'tel', keypath: 'tel', options: {unique: false}},
            {name: 'fax', keypath: 'fax', options: {unique: false}},
            {name: 'email', keypath: 'email', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
            {name: 'pathCodes', keypath: 'pathCodes', options: {unique: false}},
            {name: 'pathIds', keypath: 'pathIds', options: {unique: false}},
            {name: 'parentId', keypath: 'parentId', options: {unique: false}},
            {name: 'parent', keypath: 'parent', options: {unique: false}},
            {name: 'children', keypath: 'children', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_item,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: false}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'status', keypath: 'status', options: {unique: false}},
            {name: 'barcode', keypath: 'barcode', options: {unique: false}},
            {name: 'serial', keypath: 'serial', options: {unique: false}},
            {name: 'image', keypath: 'image', options: {unique: false}},
            {name: 'manufacturer', keypath: 'manufacturer', options: {unique: false}},
            {name: 'length', keypath: 'length', options: {unique: false}},
            {name: 'width', keypath: 'width', options: {unique: false}},
            {name: 'height', keypath: 'height', options: {unique: false}},
            {name: 'weight', keypath: 'weight', options: {unique: false}},
            {name: 'size', keypath: 'size', options: {unique: false}},
            {name: 'unit', keypath: 'unit', options: {unique: false}},
            {name: 'rate_per_unit', keypath: 'rate_per_unit', options: {unique: false}},
            {name: 'dealer_price', keypath: 'dealer_price', options: {unique: false}},
            {name: 'cost_price', keypath: 'cost_price', options: {unique: false}},
            {name: 'selling_price', keypath: 'selling_price', options: {unique: false}},
            {name: 'currency', keypath: 'currency', options: {unique: false}},
            {name: 'stock_on_hand', keypath: 'stock_on_hand', options: {unique: false}},
            {name: 'committed_stock', keypath: 'committed_stock', options: {unique: false}},
            {name: 'available_stock', keypath: 'available_stock', options: {unique: false}},
            {name: 'incoming_stock', keypath: 'incoming_stock', options: {unique: false}},
            {name: 'quantity_shipped', keypath: 'quantity_shipped', options: {unique: false}},
            {name: 'quantity_received', keypath: 'quantity_received', options: {unique: false}},
            {name: 'description', keypath: 'description', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
            {name: 'is_version', keypath: 'is_version', options: {unique: false}},
            {name: 'versions', keypath: 'versions', options: {unique: false}},
            {name: 'item_id', keypath: 'item_id', options: {unique: false}},
            {name: 'item_code', keypath: 'item_code', options: {unique: false}},
            {name: 'item', keypath: 'item', options: {unique: false}},
            {name: 'categories_id', keypath: 'categories_id', options: {unique: false}},
            {name: 'category', keypath: 'category', options: {unique: false}},
            {name: 'brand_id', keypath: 'brand_id', options: {unique: false}},
            {name: 'brand', keypath: 'brand', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_order,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'order_code', keypath: 'order_code', options: {unique: true}},
            {name: 'order_type', keypath: 'order_type', options: {unique: false}},
            {name: 'sales_person', keypath: 'sales_person', options: {unique: false}},
            {name: 'order_date', keypath: 'order_date', options: {unique: false}},
            {name: 'order_status', keypath: 'order_status', options: {unique: false}},
            {name: 'ship_to_name', keypath: 'ship_to_name', options: {unique: false}},
            {name: 'ship_to_company', keypath: 'ship_to_company', options: {unique: false}},
            {name: 'ship_to_street_address', keypath: 'ship_to_street_address', options: {unique: false}},
            {name: 'ship_to_city', keypath: 'ship_to_city', options: {unique: false}},
            {name: 'ship_to_state_province', keypath: 'ship_to_state_province', options: {unique: false}},
            {name: 'ship_to_zip_code', keypath: 'ship_to_zip_code', options: {unique: false}},
            {name: 'ship_to_country', keypath: 'ship_to_country', options: {unique: false}},
            {name: 'ship_to_tel', keypath: 'ship_to_tel', options: {unique: false}},
            {name: 'ship_to_fax', keypath: 'ship_to_fax', options: {unique: false}},
            {name: 'ship_to_email', keypath: 'ship_to_email', options: {unique: false}},
            {name: 'expected_delivery_date', keypath: 'expected_delivery_date', options: {unique: false}},
            {name: 'shipment_date', keypath: 'shipment_date', options: {unique: false}},
            {name: 'payment_terms', keypath: 'payment_terms', options: {unique: false}},
            {name: 'delivery_method', keypath: 'delivery_method', options: {unique: false}},
            {name: 'sub_total', keypath: 'sub_total', options: {unique: false}},
            {name: 'discount_rate', keypath: 'discount_rate', options: {unique: false}},
            {name: 'discount_amount', keypath: 'discount_amount', options: {unique: false}},
            {name: 'tax_rate', keypath: 'tax_rate', options: {unique: false}},
            {name: 'tax_amount', keypath: 'tax_amount', options: {unique: false}},
            {name: 'shipping_charges', keypath: 'shipping_charges', options: {unique: false}},
            {name: 'other_amount', keypath: 'other_amount', options: {unique: false}},
            {name: 'total', keypath: 'total', options: {unique: false}},
            {name: 'terms_conditions', keypath: 'terms_conditions', options: {unique: false}},
            {name: 'order_remark', keypath: 'order_remark', options: {unique: false}},
            {name: 'file_attach', keypath: 'file_attach', options: {unique: false}},
            {name: 'vendor_id', keypath: 'vendor_id', options: {unique: false}},
            {name: 'vendor', keypath: 'vendor', options: {unique: false}},
            {name: 'customer_id', keypath: 'customer_id', options: {unique: false}},
            {name: 'customer', keypath: 'customer', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_order_detail,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'quantity', keypath: 'quantity', options: {unique: false}},
            {name: 'unit_price', keypath: 'unit_price', options: {unique: false}},
            {name: 'amount', keypath: 'amount', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
            {name: 'order_id', keypath: 'order_id', options: {unique: false}},
            {name: 'order', keypath: 'order', options: {unique: false}},
            {name: 'item_id', keypath: 'item_id', options: {unique: false}},
            {name: 'item', keypath: 'item', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_inventory,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'date', keypath: 'date', options: {unique: false}},
            {name: 'reason_for_issuing', keypath: 'reason_for_issuing', options: {unique: false}},
            {name: 'total_amount', keypath: 'total_amount', options: {unique: false}},
            {name: 'deliverer', keypath: 'deliverer', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
            {name: 'status', keypath: 'status', options: {unique: false}},
            {name: 'file_attach', keypath: 'file_attach', options: {unique: false}},
            {name: 'warehouse_id', keypath: 'warehouse_id', options: {unique: false}},
            {name: 'warehouse_code', keypath: 'warehouse', options: {unique: false}},
            {name: 'warehouse', keypath: 'warehouse', options: {unique: false}},
            {name: 'vendor_customer_id', keypath: 'vendor_id', options: {unique: false}},
            {name: 'vendor_customer_code', keypath: 'vendor', options: {unique: false}},
            {name: 'vendor_customer', keypath: 'vendor', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_inventory_detail,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'quantity_orders', keypath: 'quantity_orders', options: {unique: false}},
            {name: 'quantity_actually', keypath: 'quantity_actually', options: {unique: false}},
            {name: 'unit_price', keypath: 'unit_price', options: {unique: false}},
            {name: 'amount', keypath: 'amount', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
            {name: 'batches', keypath: 'batches', options: {unique: false}},
            {name: 'series', keypath: 'series', options: {unique: false}},
            {name: 'storage', keypath: 'storage', options: {unique: false}},
            {name: 'inventory_id', keypath: 'inventory_id', options: {unique: false}},
            {name: 'inventory_code', keypath: 'inventory_code', options: {unique: false}},
            {name: 'inventory', keypath: 'inventory', options: {unique: false}},
            {name: 'item_id', keypath: 'item_id', options: {unique: false}},
            {name: 'item_code', keypath: 'item_code', options: {unique: false}},
            {name: 'item', keypath: 'item', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_category,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'image', keypath: 'image', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
            {name: 'parentId', keypath: 'parentId', options: {unique: false}},
            {name: 'parent', keypath: 'parent', options: {unique: false}},
            {name: 'children', keypath: 'children', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_adjust,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'date', keypath: 'date', options: {unique: false}},
            {name: 'reason', keypath: 'reason', options: {unique: false}},
            {name: 'file_attach', keypath: 'file_attach', options: {unique: false}},
            {name: 'warehouse_id', keypath: 'warehouse_id', options: {unique: false}},
            {name: 'warehouse', keypath: 'warehouse', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_adjust_detail,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'quanlity', keypath: 'quanlity', options: {unique: false}},
            {name: 'item_id', keypath: 'item_id', options: {unique: false}},
            {name: 'item', keypath: 'item', options: {unique: false}},
            {name: 'adjust_id', keypath: 'adjust_id', options: {unique: false}},
            {name: 'adjust', keypath: 'adjust', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.country,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'capital', keypath: 'capital', options: {unique: false}},
            {name: 'region', keypath: 'region', options: {unique: false}},
            {name: 'currency', keypath: 'currency', options: {unique: false}},
            {name: 'language', keypath: 'language', options: {unique: false}},
            {name: 'dial_code', keypath: 'dial_code', options: {unique: false}},
            {name: 'flag', keypath: 'flag', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.city,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'zip_code', keypath: 'zip_code', options: {unique: false}},
            {name: 'image', keypath: 'image', options: {unique: false}},
            {name: 'province_id', keypath: 'province_id', options: {unique: false}},
            {name: 'province', keypath: 'province', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.province,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'zip_code', keypath: 'zip_code', options: {unique: false}},
            {name: 'image', keypath: 'image', options: {unique: false}},
            {name: 'country_id', keypath: 'country_id', options: {unique: false}},
            {name: 'country', keypath: 'country', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_settings,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'image', keypath: 'image', options: {unique: false}},
            {name: 'order', keypath: 'order', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_batch_no,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'code', keypath: 'code', options: {unique: true}},
            {name: 'name', keypath: 'name', options: {unique: false}},
            {name: 'status', keypath: 'status', options: {unique: false}},
            {name: 'mfg_date', keypath: 'mfg_date', options: {unique: false}},
            {name: 'exp_date', keypath: 'exp_date', options: {unique: false}},
            {name: 'remark', keypath: 'remark', options: {unique: false}},
        ],
    }, {
        store: DB_STORE.warehouse_management,
        storeConfig: {keyPath: 'uid', autoIncrement: true},
        storeSchema: [
            {name: 'id', keypath: 'id', options: {unique: true}},
            {name: 'type', keypath: 'type', options: {unique: false}},
            {name: 'item_id', keypath: 'item_id', options: {unique: false}},
            {name: 'item_code', keypath: 'item_code', options: {unique: false}},
            {name: 'item', keypath: 'item', options: {unique: false}},
            {name: 'warehouse_id', keypath: 'warehouse_id', options: {unique: false}},
            {name: 'warehouse_code', keypath: 'warehouse_code', options: {unique: false}},
            {name: 'warehouse', keypath: 'warehouse', options: {unique: false}},
            {name: 'object_id', keypath: 'object_id', options: {unique: false}},
            {name: 'object_code', keypath: 'object_code', options: {unique: false}},
            {name: 'object', keypath: 'object', options: {unique: false}},
            {name: 'quantity', keypath: 'quantity', options: {unique: false}},
        ],
    }],
    // provide the migration factory to the DBConfig
    migrationFactory: indexFactory,
};

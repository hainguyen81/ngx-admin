/**
 * Application API configuration
 */
export const API = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Company': 'hsg',
    },
    generalSettings: {
        code: 'GENERAL_SETTINGS_API',
        baseUrl: 'http://localhost:8082/api-rest-general/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/system/general/settings',
    },
    organization: {
        code: 'ORGANIZATION_API',
        baseUrl: 'http://localhost:8082/api-rest-organization/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/system/organization',
    },
    user: {
        code: 'USER_API',
        baseUrl: 'http://localhost:8082/api-rest-user/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/system/user',
    },
    customer: {
        code: 'CUSTOMER_API',
        baseUrl: 'http://localhost:8082/api-rest-customer/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/system/customer',
    },
    warehouse: {
        code: 'WAREHOUSE_API',
        baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/warehouse',
    },
    warehouseSettings: {
        code: 'WAREHOUSE_SETTINGS_API',
        baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/warehouse/settings/general',
    },
    warehouseStorage: {
        code: 'WAREHOUSE_STORAGE_API',
        baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/warehouse/settings/storage',
    },
    warehouseCategory: {
        code: 'WAREHOUSE_CATEGORY_API',
        baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/warehouse/settings/category',
    },
    warehouseItem: {
        code: 'WAREHOUSE_ITEM_API',
        baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/warehouse/features/item',
    },
};

export const API = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Company': 'hsg',
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
    warehouseCategory: {
        code: 'WAREHOUSE_CATEGORY_API',
        baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/warehouse/category',
    },
    warehouseItem: {
        code: 'WAREHOUSE_ITEM_API',
        baseUrl: 'http://localhost:8082/api-rest-warehouse/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/warehouse/item',
    },
};

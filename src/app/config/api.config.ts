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
        client: '/dashboard/organization',
    },
    user: {
        code: 'USER_API',
        baseUrl: 'http://localhost:8082/api-rest-user/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/user',
    },
    customer: {
        code: 'CUSTOMER_API',
        baseUrl: 'http://localhost:8082/api-rest-customer/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/customer',
    },
    categories: {
        code: 'CATEGORIES_API',
        baseUrl: 'http://localhost:8082/api-rest-categories/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/categories',
    },
    warehouseItem: {
        code: 'WAREHOUSE_ITEM_API',
        baseUrl: 'http://localhost:8082/api-rest-warehouse-item/service',
        login: '/oauth/token?grant_type=client_credentials',
        method: 'POST',
        client: '/dashboard/warehouse-item',
    },
};

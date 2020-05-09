/**
 * Application API configuration
 */
export const API = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Company': 'hsg',
    },
    login: {
        code: () => 'API_AUTHORIZATION',
        name: () => 'app',
        api: {
            method: 'POST',
            url: () => 'http://localhost:8082/api-rest-oauth2/service',
            login: () => {
                const parent: any = API.login.api;
                return parent.url.call(undefined)
                    .concat('/oauth/token?grant_type=client_credentials');
            },
            regexUrl: 'oauth/**',
            version: '1.0.0',
        },
        client: {
            icon: {icon: 'sign-in', pack: 'fa'},
            url: () => '/dashboard',
        },
    },
    system: {
        code: () => 'API_SYSTEM',
        name: () => 'system.menu.module',
        api: {
            method: 'POST',
            url: () => 'http://localhost:8082/api-rest-system/service',
            login: () => {
                const parent: any = API.system.api;
                return parent.url.call(undefined)
                    .concat('/oauth/token?grant_type=client_credentials');
            },
            regexUrl: 'system/**',
            version: '1.0.0',
        },
        client: {
            icon: {icon: 'assistive-listening-systems', pack: 'fa'},
            url: () => '/dashboard/system',
        },
        children: {
            generalSettings: {
                code: () => {
                    const parent: any = API.system;
                    return parent.code.call(undefined).concat('_GENERAL_SETTINGS');
                },
                name: () => 'system.general.settings.menu',
                api: {
                    method: 'POST',
                    url: () => {
                        const parent: any = API.system.api;
                        return parent.url.call(undefined).concat('/general/settings');
                    },
                    login: () => {
                        const parent: any = API.system.api;
                        return parent.login.call(undefined);
                    },
                    regexUrl: 'system/general/**',
                    version: '1.0.0',
                },
                client: {
                    icon: {icon: 'wrench', pack: 'fa'},
                    url: () => {
                        const parent: any = API.system.client;
                        return parent.url.call(undefined).concat('/general/settings');
                    },
                },
            },
            organization: {
                code: () => {
                    const parent: any = API.system;
                    return parent.code.call(undefined).concat('_ORGANIZATION');
                },
                name: () => 'system.organization.menu',
                api: {
                    method: 'POST',
                    url: () => {
                        const parent: any = API.system.api;
                        return parent.url.call(undefined).concat('/organization');
                    },
                    login: () => {
                        const parent: any = API.system.api;
                        return parent.login.call(undefined);
                    },
                    regexUrl: 'system/organization/**',
                    version: '1.0.0',
                },
                client: {
                    icon: {icon: 'sitemap', pack: 'fa'},
                    url: () => {
                        const parent: any = API.system.client;
                        return parent.url.call(undefined).concat('/organization');
                    },
                },
            },
            user: {
                code: () => {
                    const parent: any = API.system;
                    return parent.code.call(undefined).concat('_USER');
                },
                name: () => 'system.user.menu',
                api: {
                    method: 'POST',
                    url: () => {
                        const parent: any = API.system.api;
                        return parent.url.call(undefined).concat('/user');
                    },
                    login: () => {
                        const parent: any = API.system.api;
                        return parent.login.call(undefined);
                    },
                    regexUrl: 'system/user/**',
                    version: '1.0.0',
                },
                client: {
                    icon: {icon: 'users', pack: 'fa'},
                    url: () => {
                        const parent: any = API.system.client;
                        return parent.url.call(undefined).concat('/user');
                    },
                },
            },
            customer: {
                code: () => {
                    const parent: any = API.system;
                    return parent.code.call(undefined).concat('_CUSTOMER');
                },
                name: () => 'system.customer.menu',
                api: {
                    method: 'POST',
                    url: () => {
                        const parent: any = API.system.api;
                        return parent.url.call(undefined).concat('/customer');
                    },
                    login: () => {
                        const parent: any = API.system.api;
                        return parent.login.call(undefined);
                    },
                    regexUrl: 'system/customer/**',
                    version: '1.0.0',
                },
                client: {
                    icon: {icon: 'address-card', pack: 'fa'},
                    url: () => {
                        const parent: any = API.system.client;
                        return parent.url.call(undefined).concat('/customer');
                    },
                },
            },
        },
    },
    warehouse: {
        code: () => 'API_WAREHOUSE',
        name: () => 'warehouse.menu.module',
        api: {
            method: 'POST',
            url: () => 'http://localhost:8083/api-rest-warehouse/service',
            login: () => {
                const parent: any = API.warehouse.api;
                return parent.url.call(undefined)
                    .concat('/oauth/token?grant_type=client_credentials');
            },
            regexUrl: 'warehouse/**',
            version: '1.0.0',
        },
        client: {
            icon: {icon: 'warehouse', pack: 'fas'},
            url: () => '/dashboard/warehouse',
        },
        children: {
            settings: {
                code: () => {
                    const parent: any = API.warehouse;
                    return parent.code.call(undefined).concat('_SETTINGS');
                },
                name: () => 'warehouse.menu.master',
                api: {
                    method: 'POST',
                    url: () => {
                        const parent: any = API.warehouse.api;
                        return parent.url.call(undefined).concat('/settings');
                    },
                    login: () => {
                        const parent: any = API.warehouse.api;
                        return parent.login.call(undefined);
                    },
                    regexUrl: 'warehouse/settings/**',
                    version: '1.0.0',
                },
                client: {
                    icon: {icon: 'cogs', pack: 'fa'},
                    url: () => {
                        const parent: any = API.warehouse.client;
                        return parent.url.call(undefined).concat('/settings');
                    },
                },
                children: {
                    warehouseSettings: {
                        code: () => {
                            const parent: any = API.warehouse.children.settings;
                            return parent.code.call(undefined).concat('_GENERAL');
                        },
                        name: () => 'warehouse.settings.menu',
                        api: {
                            method: 'POST',
                            url: () => {
                                const parent: any = API.warehouse.children.settings.api;
                                return parent.url.call(undefined).concat('/general');
                            },
                            login: () => {
                                const parent: any = API.warehouse.children.settings.api;
                                return parent.login.call(undefined);
                            },
                            regexUrl: 'warehouse/settings/general/**',
                            version: '1.0.0',
                        },
                        client: {
                            icon: {icon: 'cog', pack: 'fa'},
                            url: () => {
                                const parent: any = API.warehouse.children.settings.client;
                                return parent.url.call(undefined).concat('/general');
                            },
                        },
                    },
                    warehouseStorage: {
                        code: () => {
                            const parent: any = API.warehouse.children.settings;
                            return parent.code.call(undefined).concat('_STORAGE');
                        },
                        name: () => 'warehouse.storage.menu',
                        api: {
                            method: 'POST',
                            url: () => {
                                const parent: any = API.warehouse.children.settings.api;
                                return parent.url.call(undefined).concat('/storage');
                            },
                            login: () => {
                                const parent: any = API.warehouse.children.settings.api;
                                return parent.login.call(undefined);
                            },
                            regexUrl: 'warehouse/settings/storage/**',
                            version: '1.0.0',
                        },
                        client: {
                            icon: {icon: 'archive', pack: 'fa'},
                            url: () => {
                                const parent: any = API.warehouse.children.settings.client;
                                return parent.url.call(undefined).concat('/storage');
                            },
                        },
                    },
                    warehouseCategory: {
                        code: () => {
                            const parent: any = API.warehouse.children.settings;
                            return parent.code.call(undefined).concat('_CATEGORY');
                        },
                        name: () => 'warehouse.category.menu',
                        api: {
                            method: 'POST',
                            url: () => {
                                const parent: any = API.warehouse.children.settings.api;
                                return parent.url.call(undefined).concat('/category');
                            },
                            login: () => {
                                const parent: any = API.warehouse.children.settings.api;
                                return parent.login.call(undefined);
                            },
                            regexUrl: 'warehouse/settings/category/**',
                            version: '1.0.0',
                        },
                        client: {
                            icon: {icon: 'bars', pack: 'fa'},
                            url: () => {
                                const parent: any = API.warehouse.children.settings.client;
                                return parent.url.call(undefined).concat('/category');
                            },
                        },
                    },
                    warehouseBatchNo: {
                        code: () => {
                            const parent: any = API.warehouse.children.settings;
                            return parent.code.call(undefined).concat('_BATCH_NO');
                        },
                        name: () => 'warehouse.batch_no.menu',
                        api: {
                            method: 'POST',
                            url: () => {
                                const parent: any = API.warehouse.children.settings.api;
                                return parent.url.call(undefined).concat('/batchno');
                            },
                            login: () => {
                                const parent: any = API.warehouse.children.settings.api;
                                return parent.login.call(undefined);
                            },
                            regexUrl: 'warehouse/settings/batchno/**',
                            version: '1.0.0',
                        },
                        client: {
                            icon: {icon: 'clock', pack: 'fas'},
                            url: () => {
                                const parent: any = API.warehouse.children.settings.client;
                                return parent.url.call(undefined).concat('/batchno');
                            },
                        },
                    },
                },
            },
            features: {
                code: () => {
                    const parent: any = API.warehouse;
                    return parent.code.call(undefined).concat('_FEATURES');
                },
                name: () => 'warehouse.menu.features',
                api: {
                    method: 'POST',
                    url: () => {
                        const parent: any = API.warehouse.api;
                        return parent.url.call(undefined).concat('/features');
                    },
                    login: () => {
                        const parent: any = API.warehouse.api;
                        return parent.login.call(undefined);
                    },
                    regexUrl: 'warehouse/features/**',
                    version: '1.0.0',
                },
                client: {
                    icon: {icon: 'briefcase', pack: 'fas'},
                    url: () => {
                        const parent: any = API.warehouse.client;
                        return parent.url.call(undefined).concat('/features');
                    },
                },
                children: {
                    warehouseItem: {
                        code: () => {
                            const parent: any = API.warehouse.children.features;
                            return parent.code.call(undefined).concat('_ITEM');
                        },
                        name: () => 'warehouse.item.menu',
                        api: {
                            method: 'POST',
                            url: () => {
                                const parent: any = API.warehouse.children.features.api;
                                return parent.url.call(undefined).concat('/item');
                            },
                            login: () => {
                                const parent: any = API.warehouse.children.features.api;
                                return parent.login.call(undefined);
                            },
                            regexUrl: 'warehouse/features/item/**',
                            version: '1.0.0',
                        },
                        client: {
                            icon: {icon: 'boxes', pack: 'fa'},
                            url: () => {
                                const parent: any = API.warehouse.children.features.client;
                                return parent.url.call(undefined).concat('/item');
                            },
                        },
                    },
                    warehouseInventory: {
                        code: () => {
                            const parent: any = API.warehouse.children.features;
                            return parent.code.call(undefined).concat('_INVENTORY');
                        },
                        name: () => 'warehouse.inventory.menu',
                        api: {
                            method: 'POST',
                            url: () => {
                                const parent: any = API.warehouse.children.features.api;
                                return parent.url.call(undefined).concat('/inventory');
                            },
                            login: () => {
                                const parent: any = API.warehouse.children.features.api;
                                return parent.login.call(undefined);
                            },
                            regexUrl: 'warehouse/features/inventory/**',
                            version: '1.0.0',
                        },
                        client: {
                            icon: {icon: 'truck-loading', pack: 'fas'},
                            url: () => {
                                const parent: any = API.warehouse.children.features.client;
                                return parent.url.call(undefined).concat('/inventory');
                            },
                        },
                    },
                },
            },
        },
    },
};

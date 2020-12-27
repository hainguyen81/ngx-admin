/**
 * Application API configuration
 */
export function buildApiConfig() {
    const config: any = {
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
                    const parent: any = config.login.api;
                    return parent.url.call(parent)
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
                    const parent: any = config.system.api;
                    return parent.url.call(parent)
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
                        const parent: any = config.system;
                        return parent.code.call(parent).concat('_GENERAL_SETTINGS');
                    },
                    name: () => 'system.general.settings.menu',
                    api: {
                        method: 'POST',
                        url: () => {
                            const parent: any = config.system.api;
                            return parent.url.call(parent).concat('/general/settings');
                        },
                        login: () => {
                            const parent: any = config.system.api;
                            return parent.login.call(parent);
                        },
                        regexUrl: 'system/general/**',
                        version: '1.0.0',
                    },
                    client: {
                        icon: {icon: 'wrench', pack: 'fa'},
                        url: () => {
                            const parent: any = config.system.client;
                            return parent.url.call(parent).concat('/general/settings');
                        },
                    },
                },
                organization: {
                    code: () => {
                        const parent: any = config.system;
                        return parent.code.call(parent).concat('_ORGANIZATION');
                    },
                    name: () => 'system.organization.menu',
                    api: {
                        method: 'POST',
                        url: () => {
                            const parent: any = config.system.api;
                            return parent.url.call(parent).concat('/organization');
                        },
                        login: () => {
                            const parent: any = config.system.api;
                            return parent.login.call(parent);
                        },
                        regexUrl: 'system/organization/**',
                        version: '1.0.0',
                    },
                    client: {
                        icon: {icon: 'sitemap', pack: 'fa'},
                        url: () => {
                            const parent: any = config.system.client;
                            return parent.url.call(parent).concat('/organization');
                        },
                    },
                },
                user: {
                    code: () => {
                        const parent: any = config.system;
                        return parent.code.call(parent).concat('_USER');
                    },
                    name: () => 'system.user.menu',
                    api: {
                        method: 'POST',
                        url: () => {
                            const parent: any = config.system.api;
                            return parent.url.call(parent).concat('/user');
                        },
                        login: () => {
                            const parent: any = config.system.api;
                            return parent.login.call(parent);
                        },
                        regexUrl: 'system/user/**',
                        version: '1.0.0',
                    },
                    client: {
                        icon: {icon: 'users', pack: 'fa'},
                        url: () => {
                            const parent: any = config.system.client;
                            return parent.url.call(parent).concat('/user');
                        },
                    },
                },
                customer: {
                    code: () => {
                        const parent: any = config.system;
                        return parent.code.call(parent).concat('_CUSTOMER');
                    },
                    name: () => 'system.customer.menu',
                    api: {
                        method: 'POST',
                        url: () => {
                            const parent: any = config.system.api;
                            return parent.url.call(parent).concat('/customer');
                        },
                        login: () => {
                            const parent: any = config.system.api;
                            return parent.login.call(parent);
                        },
                        regexUrl: 'system/customer/**',
                        version: '1.0.0',
                    },
                    client: {
                        icon: {icon: 'address-card', pack: 'fa'},
                        url: () => {
                            const parent: any = config.system.client;
                            return parent.url.call(parent).concat('/customer');
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
                    const parent: any = config.warehouse.api;
                    return parent.url.call(parent)
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
                        const parent: any = config.warehouse;
                        return parent.code.call(parent).concat('_SETTINGS');
                    },
                    name: () => 'warehouse.menu.master',
                    api: {
                        method: 'POST',
                        url: () => {
                            const parent: any = config.warehouse.api;
                            return parent.url.call(parent).concat('/settings');
                        },
                        login: () => {
                            const parent: any = config.warehouse.api;
                            return parent.login.call(parent);
                        },
                        regexUrl: 'warehouse/settings/**',
                        version: '1.0.0',
                    },
                    client: {
                        icon: {icon: 'cogs', pack: 'fa'},
                        url: () => {
                            const parent: any = config.warehouse.client;
                            return parent.url.call(parent).concat('/settings');
                        },
                    },
                    children: {
                        warehouseSettings: {
                            code: () => {
                                const parent: any = config.warehouse.children.settings;
                                return parent.code.call(parent).concat('_GENERAL');
                            },
                            name: () => 'warehouse.settings.menu',
                            api: {
                                method: 'POST',
                                url: () => {
                                    const parent: any = config.warehouse.children.settings.api;
                                    return parent.url.call(parent).concat('/general');
                                },
                                login: () => {
                                    const parent: any = config.warehouse.children.settings.api;
                                    return parent.login.call(parent);
                                },
                                regexUrl: 'warehouse/settings/general/**',
                                version: '1.0.0',
                            },
                            client: {
                                icon: {icon: 'cog', pack: 'fa'},
                                url: () => {
                                    const parent: any = config.warehouse.children.settings.client;
                                    return parent.url.call(parent).concat('/general');
                                },
                            },
                        },
                        warehouseStorage: {
                            code: () => {
                                const parent: any = config.warehouse.children.settings;
                                return parent.code.call(parent).concat('_STORAGE');
                            },
                            name: () => 'warehouse.storage.menu',
                            api: {
                                method: 'POST',
                                url: () => {
                                    const parent: any = config.warehouse.children.settings.api;
                                    return parent.url.call(parent).concat('/storage');
                                },
                                login: () => {
                                    const parent: any = config.warehouse.children.settings.api;
                                    return parent.login.call(parent);
                                },
                                regexUrl: 'warehouse/settings/storage/**',
                                version: '1.0.0',
                            },
                            client: {
                                icon: {icon: 'archive', pack: 'fa'},
                                url: () => {
                                    const parent: any = config.warehouse.children.settings.client;
                                    return parent.url.call(parent).concat('/storage');
                                },
                            },
                        },
                        warehouseCategory: {
                            code: () => {
                                const parent: any = config.warehouse.children.settings;
                                return parent.code.call(parent).concat('_CATEGORY');
                            },
                            name: () => 'warehouse.category.menu',
                            api: {
                                method: 'POST',
                                url: () => {
                                    const parent: any = config.warehouse.children.settings.api;
                                    return parent.url.call(parent).concat('/category');
                                },
                                login: () => {
                                    const parent: any = config.warehouse.children.settings.api;
                                    return parent.login.call(parent);
                                },
                                regexUrl: 'warehouse/settings/category/**',
                                version: '1.0.0',
                            },
                            client: {
                                icon: {icon: 'bars', pack: 'fa'},
                                url: () => {
                                    const parent: any = config.warehouse.children.settings.client;
                                    return parent.url.call(parent).concat('/category');
                                },
                            },
                        },
                        warehouseBatchNo: {
                            code: () => {
                                const parent: any = config.warehouse.children.settings;
                                return parent.code.call(parent).concat('_BATCH_NO');
                            },
                            name: () => 'warehouse.batch_no.menu',
                            api: {
                                method: 'POST',
                                url: () => {
                                    const parent: any = config.warehouse.children.settings.api;
                                    return parent.url.call(parent).concat('/batchno');
                                },
                                login: () => {
                                    const parent: any = config.warehouse.children.settings.api;
                                    return parent.login.call(parent);
                                },
                                regexUrl: 'warehouse/settings/batchno/**',
                                version: '1.0.0',
                            },
                            client: {
                                icon: {icon: 'clock', pack: 'fas'},
                                url: () => {
                                    const parent: any = config.warehouse.children.settings.client;
                                    return parent.url.call(parent).concat('/batchno');
                                },
                            },
                        },
                    },
                },
                features: {
                    code: () => {
                        const parent: any = config.warehouse;
                        return parent.code.call(parent).concat('_FEATURES');
                    },
                    name: () => 'warehouse.menu.features',
                    api: {
                        method: 'POST',
                        url: () => {
                            const parent: any = config.warehouse.api;
                            return parent.url.call(parent).concat('/features');
                        },
                        login: () => {
                            const parent: any = config.warehouse.api;
                            return parent.login.call(parent);
                        },
                        regexUrl: 'warehouse/features/**',
                        version: '1.0.0',
                    },
                    client: {
                        icon: {icon: 'briefcase', pack: 'fas'},
                        url: () => {
                            const parent: any = config.warehouse.client;
                            return parent.url.call(parent).concat('/features');
                        },
                    },
                    children: {
                        warehouseItem: {
                            code: () => {
                                const parent: any = config.warehouse.children.features;
                                return parent.code.call(parent).concat('_ITEM');
                            },
                            name: () => 'warehouse.item.menu',
                            api: {
                                method: 'POST',
                                url: () => {
                                    const parent: any = config.warehouse.children.features.api;
                                    return parent.url.call(parent).concat('/item');
                                },
                                login: () => {
                                    const parent: any = config.warehouse.children.features.api;
                                    return parent.login.call(parent);
                                },
                                regexUrl: 'warehouse/features/item/**',
                                version: '1.0.0',
                            },
                            client: {
                                icon: {icon: 'boxes', pack: 'fa'},
                                url: () => {
                                    const parent: any = config.warehouse.children.features.client;
                                    return parent.url.call(parent).concat('/item');
                                },
                            },
                        },
                        warehouseInventory: {
                            code: () => {
                                const parent: any = config.warehouse.children.features;
                                return parent.code.call(parent).concat('_INVENTORY');
                            },
                            name: () => 'warehouse.inventory.menu',
                            api: {
                                method: 'POST',
                                url: () => {
                                    const parent: any = config.warehouse.children.features.api;
                                    return parent.url.call(parent).concat('/inventory');
                                },
                                login: () => {
                                    const parent: any = config.warehouse.children.features.api;
                                    return parent.login.call(parent);
                                },
                                regexUrl: 'warehouse/features/inventory/**',
                                version: '1.0.0',
                            },
                            client: {
                                icon: {icon: 'truck-loading', pack: 'fas'},
                                url: () => {
                                    const parent: any = config.warehouse.children.features.client;
                                    return parent.url.call(parent).concat('/inventory');
                                },
                            },
                        },
                    },
                },
            },
        },
    };
    return config;
}

export const API: any = buildApiConfig();

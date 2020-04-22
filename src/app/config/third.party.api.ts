import {environment} from '../../environments/environment';

/**
 * Third-party API configuration
 */
export const THIRD_PARTY_API = {
    // https://www.universal-tutorial.com/rest-apis/free-rest-api-for-country-state-city
    universal: {
        code: 'UNIVERSAL',
        baseUrl: 'https://www.universal-tutorial.com/',
        api: {
            token: {
                email: 'hainguyenjc@gmail.com',
                vapid_public_key: 'M70onCyk9pjjPxfwNiM3TyerUYNPGI26ZqBKuqhAP6LmE3Ct2bR91gw8QPg4D5Aom14',
                tokenUrl: () => (environment.useProxy ? '' : this.baseUrl).concat('api/getaccesstoken'),
                // 24(h) * 60(m) * 60(s) * 1000(ms)
                expiredIn: 86400000,
            },
            country: {
                url: () => (environment.useProxy ? '' : this.baseUrl).concat('api/countries'),
                method: 'GET',
            },
            province: {
                url: (environment.useProxy ? '' : this.baseUrl).concat('api/states'),
                method: 'GET',
            },
            city: {
                url: (environment.useProxy ? '' : this.baseUrl).concat('api/cities'),
                method: 'GET',
            },
        },
    },
};

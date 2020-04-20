/**
 * Third-party API configuration
 */
export const THIRD_PARTY_API = {
    // https://www.universal-tutorial.com/rest-apis/free-rest-api-for-country-state-city
    universal: {
        code: 'UNIVERSAL',
        email: 'hainguyenjc@gmail.com',
        vapid_public_key: 'M70onCyk9pjjPxfwNiM3TyerUYNPGI26ZqBKuqhAP6LmE3Ct2bR91gw8QPg4D5Aom14',
        // // TODO for proxy case
        // baseUrl: 'https://www.universal-tutorial.com/',
        // TODO for non-proxy case
        baseUrl: null,
        tokenUrl: 'api/getaccesstoken',
        api: {
            country: {
                // TODO for proxy case
                url: 'api/countries',
                // // TODO for non-proxy case
                // url: 'https://www.universal-tutorial.com/api/countries',
                method: 'GET',
            },
            city: {
                // TODO for proxy case
                url: 'api/states',
                // // TODO for non-proxy case
                // url: 'https://www.universal-tutorial.com/api/states',
                method: 'GET',
            },
            province: {
                // TODO for proxy case
                url: 'api/states',
                // // TODO for non-proxy case
                // url: 'https://www.universal-tutorial.com/api/states',
                method: 'GET',
            },
        },
    },
};

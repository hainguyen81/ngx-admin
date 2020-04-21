/**
 * Third-party API configuration
 */
export const THIRD_PARTY_API = {
    // https://www.universal-tutorial.com/rest-apis/free-rest-api-for-country-state-city
    universal: {
        code: 'UNIVERSAL',
        email: 'hainguyenjc@gmail.com',
        vapid_public_key: 'M70onCyk9pjjPxfwNiM3TyerUYNPGI26ZqBKuqhAP6LmE3Ct2bR91gw8QPg4D5Aom14',
        // baseUrl: 'https://www.universal-tutorial.com/',
        baseUrl: null,
        tokenUrl: 'api/getaccesstoken',
        api: {
            country: {
                // url: 'https://www.universal-tutorial.com/api/countries',
                url: 'api/countries',
                method: 'GET',
            },
            province: {
                // url: 'https://www.universal-tutorial.com/api/states',
                url: 'api/states',
                method: 'GET',
            },
            city: {
                // url: 'https://www.universal-tutorial.com/api/cities',
                url: 'api/cities',
                method: 'GET',
            },
        },
    },
};

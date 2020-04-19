/**
 * Third-party API configuration
 */
export const THIRD_PARTY_API = {
    // https://www.universal-tutorial.com/rest-apis/free-rest-api-for-country-state-city
    universal: {
        code: 'UNIVERSAL',
        email: 'hainguyenjc@gmail.com',
        vapid_public_key: 'M70onCyk9pjjPxfwNiM3TyerUYNPGI26ZqBKuqhAP6LmE3Ct2bR91gw8QPg4D5Aom14',
        tokenUrl: 'https://www.universal-tutorial.com/api/getaccesstoken',
        api: {
            country: {
                url: 'https://www.universal-tutorial.com/api/countries',
                method: 'GET',
            },
            city: {
                url: 'https://www.universal-tutorial.com/api/cities',
                method: 'GET',
            },
            province: {
                url: 'https://www.universal-tutorial.com/api/states',
                method: 'GET',
            },
        },
    },
};

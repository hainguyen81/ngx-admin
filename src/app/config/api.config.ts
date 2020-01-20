export const API = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Company': 'hsg',
  },
  user: {
    baseUrl: 'http://localhost:8082/api-rest-user/service',
    login: '/oauth/token?grant_type=client_credentials',
    method: 'POST',
  },
};

export const RC_AUTH_AUTHORIZATION_HEADER = 'Authorization';
export const RC_COMPANY_HEADER = 'Company';
export const RC_AUTH_ACCESS_TOKEN_PARAM = 'access_token';
export const RC_AUTH_REFRESH_TOKEN_PARAM = 'refresh_token';
export const RC_AUTH_AUTHORIZATION_BASIC_TYPE = 'Basic';
export const RC_AUTH_AUTHORIZATION_BEARER_TYPE = 'Bearer';
export const RC_THIRD_PARTY_CUSTOM_TYPE = 'X-ThirdParty';

// CORS headers
export const RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER = 'Access-Control-Allow-Origin';
export const RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER_ALL = '*';
export const RC_ACCESS_CONTROL_ALLOW_METHODS_HEADER = 'Access-Control-Allow-Methods';
export const RC_ACCESS_CONTROL_ALLOW_METHODS_HEADER_ALL = '*';
export const RC_ACCESS_CONTROL_ALLOW_HEADERS_HEADER = 'Access-Control-Allow-Headers';
export const RC_ACCESS_CONTROL_ALLOW_HEADERS_HEADER_ALL = '*';
export const RC_SERVICE_WORKER_ALLOWED_HEADER = 'Service-Worker-Allowed';
export const RC_SERVICE_WORKER_ALLOWED_HEADER_ALL = '*';

export function buildRequestDefaultHeaders() {
    const headers: { [header: string]: string | string[]; } = {};
    headers[RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER] = RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER_ALL;
    headers[RC_ACCESS_CONTROL_ALLOW_METHODS_HEADER] = RC_ACCESS_CONTROL_ALLOW_METHODS_HEADER_ALL;
    headers[RC_ACCESS_CONTROL_ALLOW_HEADERS_HEADER] = RC_ACCESS_CONTROL_ALLOW_HEADERS_HEADER_ALL;
    headers[RC_SERVICE_WORKER_ALLOWED_HEADER] = RC_SERVICE_WORKER_ALLOWED_HEADER_ALL;
    return headers;
}
export const RC_DEFAULT_HEADERS: { [header: string]: string | string[]; } = buildRequestDefaultHeaders();

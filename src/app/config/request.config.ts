export const RC_AUTH_AUTHORIZATION_HEADER = 'Authorization';
export const RC_COMPANY_HEADER = 'Company';
export const RC_AUTH_ACCESS_TOKEN_PARAM = 'access_token';
export const RC_AUTH_REFRESH_TOKEN_PARAM = 'refresh_token';
export const RC_AUTH_AUTHORIZATION_BASIC_TYPE = 'Basic';
export const RC_AUTH_AUTHORIZATION_BEARER_TYPE = 'Bearer';
export const RC_THIRD_PARTY_CUSTOM_TYPE = 'X-Third-Party';

// CORS headers
export const RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER = 'access-control-allow-origin';
export const RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER_ALL = '*';
export const RC_ACCESS_CONTROL_ALLOW_METHODS_HEADER = 'access-control-allow-methods';
export const RC_ACCESS_CONTROL_ALLOW_METHODS_HEADER_ALL = '*';
export const RC_ACCESS_CONTROL_ALLOW_HEADERS_HEADER = 'access-control-allow-headers';
export const RC_ACCESS_CONTROL_ALLOW_HEADERS_HEADER_ALL = '*';
export const RC_DEFAULT_HEADERS: { [header: string]: string | string[]; } = {
    RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER: RC_ACCESS_CONTROL_ALLOW_ORIGIN_HEADER_ALL,
    RC_ACCESS_CONTROL_ALLOW_METHODS_HEADER: RC_ACCESS_CONTROL_ALLOW_METHODS_HEADER_ALL,
    RC_ACCESS_CONTROL_ALLOW_HEADERS_HEADER: RC_ACCESS_CONTROL_ALLOW_HEADERS_HEADER_ALL,
};

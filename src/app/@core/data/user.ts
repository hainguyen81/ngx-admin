import { RolesGroup } from './roles.group';

export interface User {
  id: string;
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  company: string;
  enterprise?: boolean | false;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: number;
  rolesGroupId: string | null;
  rolesGroup?: RolesGroup | null;
}

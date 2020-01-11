import { Observable } from 'rxjs';

import { RolesGroup } from './roles.group';

export interface User {
  id: string;
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: bigint;
  scope: string;
  company: string;
  enterprise?: boolean | false;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: bigint;
  rolesGroupId: string;
  rolesGroup?: RolesGroup[] | [];
}

export abstract class UserData {
  abstract getUsers(): Observable<User[]>;
}

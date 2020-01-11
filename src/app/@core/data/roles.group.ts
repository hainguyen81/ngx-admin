import { Role } from './role';

export interface RolesGroup {
  id: string;
  company: string;
  code: string;
  name: string;
  roles?: Role[] | [];
}

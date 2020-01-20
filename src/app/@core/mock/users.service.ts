import {of as observableOf,  Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Api} from '../data/api';
import {Module} from '../data/module';
import {Role} from '../data/role';
import {RolesGroup} from '../data/roles.group';
import {User} from '../data/user';

@Injectable()
export class MockUserService {

  private apiMedia: Api = {
    code: 'MEDIA',
    name: 'Media Management',
    regexUrl: 'media/**',
    version: '1.0.0',
    id: '5d7660cd738fbc23b43a857e',
  };
  private api = {
    media: this.apiMedia,
  };

  private cameraModule: Module = {
    code: 'camList',
    name: 'Danh sách Camera',
    apiId: '5d7660cd738fbc23b43a857e',
    api: this.api.media,
    id: '5d54a805c1bb1a2fdc13400a',
  };
  private module = {
    camList: this.cameraModule,
  };

  private role: Role = {
    moduleId: '5d54a805c1bb1a2fdc13400a',
    module: this.module.camList,
    groupId: '5d766194738fbc23b43a857f',
    writable: true,
    id: '5d577a746d665e1430e95c17',
  };

  private rolesGroup: RolesGroup = {
    company: 'hsg',
    code: 'ADM_MEDIA',
    name: 'Media Administrators',
    roles: [ this.role ],
    id: '5d766194738fbc23b43a857f',
  };

  private adminUser: User = {
    access_token: 'f90087e0-398e-4124-9522-5a4e6f0bed91',
    token_type: 'bearer',
    refresh_token: 'ac581551-9dd4-404a-8a4a-ecf591ebb9d0',
    expires_in: 7889236,
    scope: 'READ WRITE',
    company: 'hsg',
    enterprise: true,
    username: 'admin@hsg.com',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'admin@hsg.com',
    status: 1,
    rolesGroup: this.rolesGroup,
    id: '5d5d67786249ab06b4516c45',
    rolesGroupId: '5d766194738fbc23b43a857f',
  };
  private users = {
    admin: this.adminUser,
  };

  public getUsers(): Observable<any> {
    return observableOf(this.users);
  }

  public findUser(key: string, value?: any): User {
    let u: User;
    for (let k in this.users) {
      const user = this.users[k];
      if (user && user.hasOwnProperty(key) && user[key] === value) {
        u = user;
        break;
      }
    }
    return u;
  }
}

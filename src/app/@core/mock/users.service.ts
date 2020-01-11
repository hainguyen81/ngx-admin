import { of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Api } from '../data/api';
import { Module } from '../data/module';
import { Role } from '../data/role';
import { RolesGroup } from '../data/roles.group';
import { UserData } from '../data/users';

@Injectable()
export class UserService extends UserData {

  private api = {
    media: {
      code: 'MEDIA',
      name: 'Media Management',
      regexUrl: 'media/**',
      version: '1.0.0',
      id: '5d7660cd738fbc23b43a857e',
    },
  };

  private module = {
    camList: {
      code: 'camList',
      name: 'Danh sách Camera',
      apiId: '5d7660cd738fbc23b43a857e',
      api: this.api.media,
      id: '5d54a805c1bb1a2fdc13400a',
    },
  };

  private role = {
    moduleId: '5d54a805c1bb1a2fdc13400a',
    module: this.module.camList,
    groupId: '5d766194738fbc23b43a857f',
    writable: 1,
    id: '5d577a746d665e1430e95c17',
  };

  private rolesGroup = {
    company: 'hsg',
    code: 'ADM_MEDIA',
    name: 'Media Administrators',
    roles: [ this.role ],
    id: '5d766194738fbc23b43a857f',
  };

  private users = {
    admin: {
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
    },
  };

  getUsers(): Observable<any> {
    return observableOf(this.users);
  }
}

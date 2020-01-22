import {of as observableOf, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {IApi} from '../data/api';
import {IModule} from '../data/module';
import {IRole} from '../data/role';
import {IRolesGroup} from '../data/roles.group';
import {IUser} from '../data/user';

@Injectable()
export class MockUserService {

    private userApi: IApi = {
        code: 'USER_API',
        name: 'User Management',
        regexUrl: 'user/**',
        baseUrl: 'http://localhost:8082/api-rest-user/service',
        icon: 'home-outline',
        version: '1.0.0',
        id: '5d7660cd738fbc23b43a857e',
    };
    private api = {
        user: this.userApi,
    };

    private userModule: IModule = {
        code: 'USER_MODULE',
        name: 'Danh sách người dùng',
        apiId: '',
        api: this.api.user,
        id: '',
        children: [],
    };
    private systemModule: IModule = {
        code: 'SYSTEM',
        name: 'Hệ thống',
        apiId: '',
        api: null,
        id: '',
        children: [this.userModule],
    };
    private module = {
        system: this.systemModule,
    };

    private role: IRole = {
        moduleId: '5d54a805c1bb1a2fdc13400a',
        module: this.module.system,
        groupId: '5d766194738fbc23b43a857f',
        writable: true,
        id: '5d577a746d665e1430e95c17',
    };

    private rolesGroup: IRolesGroup = {
        company: 'hsg',
        code: 'SYSTEM',
        name: 'System',
        roles: [this.role],
        id: '',
    };

    private adminUser: IUser = {
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

    public findUser(key: string, value?: any): IUser {
        for (const user of Object.values(this.users)) {
            if (user && user.hasOwnProperty(key) && user[key] === value) {
                return user;
            }
        }
        return undefined;
    }
}

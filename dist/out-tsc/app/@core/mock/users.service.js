import * as tslib_1 from "tslib";
import { of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserData } from '../data/users';
let UserService = class UserService extends UserData {
    constructor() {
        super(...arguments);
        this.apiMedia = {
            code: 'MEDIA',
            name: 'Media Management',
            regexUrl: 'media/**',
            version: '1.0.0',
            id: '5d7660cd738fbc23b43a857e',
        };
        this.api = {
            media: this.apiMedia,
        };
        this.cameraModule = {
            code: 'camList',
            name: 'Danh sách Camera',
            apiId: '5d7660cd738fbc23b43a857e',
            api: this.api.media,
            id: '5d54a805c1bb1a2fdc13400a',
        };
        this.module = {
            camList: this.cameraModule,
        };
        this.role = {
            moduleId: '5d54a805c1bb1a2fdc13400a',
            module: this.module.camList,
            groupId: '5d766194738fbc23b43a857f',
            writable: true,
            id: '5d577a746d665e1430e95c17',
        };
        this.rolesGroup = {
            company: 'hsg',
            code: 'ADM_MEDIA',
            name: 'Media Administrators',
            roles: [this.role],
            id: '5d766194738fbc23b43a857f',
        };
        this.adminUser = {
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
        this.users = {
            admin: this.adminUser,
        };
    }
    getUsers() {
        return observableOf(this.users);
    }
};
UserService = tslib_1.__decorate([
    Injectable()
], UserService);
export { UserService };
//# sourceMappingURL=users.service.js.map
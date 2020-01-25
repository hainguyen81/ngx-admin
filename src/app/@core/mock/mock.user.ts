import {IUser, USER_STATUS} from '../data/user';
import {MockRolesGroupSystem} from './mock.role';

export const MockUserAdmin: IUser = {
    access_token: 'f90087e0-398e-4124-9522-5a4e6f0bed91',
    token_type: 'bearer',
    refresh_token: 'ac581551-9dd4-404a-8a4a-ecf591ebb9d0',
    expires_in: 7889236,
    scope: 'READ WRITE',
    company: 'hsg',
    enterprise: true,
    username: 'admin@hsg.com',
    password: 'admin',
    firstName: 'Administrator First Name',
    lastName: 'Administrator Last Name',
    email: 'admin@hsg.com',
    status: USER_STATUS.ACTIVATED,
    rolesGroup: MockRolesGroupSystem,
    id: '5d5d67786249ab06b4516c45',
    rolesGroupId: '5d766194738fbc23b43a857f',
};
export const MockUser1: IUser = {
    access_token: 'f90087e0-398e-4124-9522-5a4e6f0bed91',
    token_type: 'bearer',
    refresh_token: 'ac581551-9dd4-404a-8a4a-ecf591ebb9d0',
    expires_in: 7889236,
    scope: 'READ WRITE',
    company: 'hsg',
    enterprise: true,
    username: 'user1@hsg.com',
    password: 'admin',
    firstName: 'User1 First Name',
    lastName: 'User1 Last Name',
    email: 'user1@hsg.com',
    status: USER_STATUS.ACTIVATED,
    rolesGroup: MockRolesGroupSystem,
    id: '5d5d67786249ab06b4516c45',
    rolesGroupId: '5d766194738fbc23b43a857f',
};
export const MockUser2: IUser = {
    access_token: 'f90087e0-398e-4124-9522-5a4e6f0bed91',
    token_type: 'bearer',
    refresh_token: 'ac581551-9dd4-404a-8a4a-ecf591ebb9d0',
    expires_in: 7889236,
    scope: 'READ WRITE',
    company: 'hsg',
    enterprise: true,
    username: 'user2@hsg.com',
    password: 'admin',
    firstName: 'User2 First Name',
    lastName: 'User2 Last Name',
    email: 'user2@hsg.com',
    status: USER_STATUS.ACTIVATED,
    rolesGroup: MockRolesGroupSystem,
    id: '5d5d67786249ab06b4516c45',
    rolesGroupId: '5d766194738fbc23b43a857f',
};

export const MockUser = [
    MockUserAdmin,
    MockUser1,
    MockUser2,
];

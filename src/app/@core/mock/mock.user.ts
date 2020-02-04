import {IUser, USER_STATUS} from '../data/user';
import {MockRolesGroupSystem} from './mock.role';
import ObjectUtils from '../../utils/object.utils';
import {IdGenerators} from '../../config/generator.config';
import EncryptionUtils from '../../utils/encryption.utils';

export const MAXIMUM_MOCK_USERS: number = 100;

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
export const MockUserTemplate: IUser = {
    access_token: 'f90087e0-398e-4124-9522-5a4e6f0bed92',
    token_type: 'bearer',
    refresh_token: 'ac581551-9dd4-404a-8a4a-ecf591ebb9d1',
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
    id: '5d5d67786249ab06b4516c46',
    rolesGroupId: '5d766194738fbc23b43a857f',
};

export const MockUser = [
    MockUserAdmin,
];

export function usersGenerate(): IUser[] {
    let mockUsers: IUser[];
    mockUsers = MockUser;
    for (let i: number = 0; i < MAXIMUM_MOCK_USERS; i++) {
        let mockUser: IUser;
        mockUser = ObjectUtils.deepCopy(MockUserTemplate);
        mockUser.id = IdGenerators.oid.generate();
        mockUser.access_token = IdGenerators.uuid.v4();
        mockUser.refresh_token = IdGenerators.uuid.v4();
        mockUser.username = 'user'.concat((i + 1).toString(), '@hsg.com');
        mockUser.email = mockUser.username;
        mockUser.password = EncryptionUtils.md5Encode(':', mockUser.password);
        mockUser.firstName = 'User'.concat((i + 1).toString(), ' First Name');
        mockUser.lastName = 'User'.concat((i + 1).toString(), ' Last Name');
        mockUsers.push(mockUser);
    }
    mockUsers[0].password = EncryptionUtils.md5Encode(':', mockUsers[0].password);
    return mockUsers;
}

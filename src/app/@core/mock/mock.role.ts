import {IRole} from '../data/role';
import {IRolesGroup} from '../data/roles.group';
import {MockModuleSystem} from './mock.module';

export const MockRoleSystem: IRole = {
    moduleId: '5d54a805c1bb1a2fdc13400a',
    module: MockModuleSystem,
    groupId: '5d766194738fbc23b43a857f',
    writable: true,
    id: '5d577a746d665e1430e95c17',
};

export const MockRolesGroupSystem: IRolesGroup = {
    company: 'hsg',
    code: 'SYSTEM',
    name: 'System',
    roles: [MockRoleSystem],
    id: '',
};

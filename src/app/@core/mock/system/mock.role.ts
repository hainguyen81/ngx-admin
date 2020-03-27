import {IRole} from '../../data/system/role';
import {IRolesGroup} from '../../data/system/roles.group';
import {MockModuleSystem, MockModuleWarehouse} from './mock.module';

export const MockRoleSystem: IRole = {
    moduleId: '5d54a805c1bb1a2fdc13400a',
    module: MockModuleSystem,
    groupId: '5d766194738fbc23b43a857f',
    writable: true,
    id: '5d577a746d665e1430e95c17',
};

export const MockRoleWarehouse: IRole = {
    moduleId: '5d54a805c1bb1a2fdc13400b',
    module: MockModuleWarehouse,
    groupId: '5d766194738fbc23b43a857g',
    writable: true,
    id: '5d577a746d665e1430e95c17',
};

export const MockRolesAdmin: IRolesGroup = {
    company: 'hsg',
    code: 'SYSTEM',
    name: 'System',
    roles: [MockRoleSystem, MockRoleWarehouse],
    id: '5d766194738fbc23b43a857f',
};


import ObjectUtils from '../../../utils/object.utils';
import {IdGenerators} from '../../../config/generator.config';
import {MockUserAdmin} from './mock.user';
import {IOrganization} from '../../data/system/organization';
import {Constants} from '../../data/constants/organization.constants';
import ORGANIZATION_TYPE = Constants.OrganizationConstants.ORGANIZATION_TYPE;

export const MAXIMUM_MOCK_ORGANIZATION_HEAD: number = 10;
export const MAXIMUM_MOCK_ORGANIZATION_BRANCH: number = 10;
export const MAXIMUM_MOCK_ORGANIZATION_DEPARTMENT: number = 20;

export const MockOrganizationHeadTemplate: IOrganization = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: ORGANIZATION_TYPE.HEAD_CENTER,
};

export const MockOrganizationBranchTemplate: IOrganization = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: ORGANIZATION_TYPE.BRANCH,
};

export const MockOrganizationDepartmentTemplate: IOrganization = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: ORGANIZATION_TYPE.DEPARTMENT,
};

export function organizationGenerate(): IOrganization[] {
    let mockOrganization: IOrganization[];
    mockOrganization = [];
    for (let i: number = 0; i < MAXIMUM_MOCK_ORGANIZATION_HEAD; i++) {
        let mockOrgHead: IOrganization;
        mockOrgHead = ObjectUtils.deepCopy(MockOrganizationHeadTemplate);
        mockOrgHead.id = IdGenerators.oid.generate();
        mockOrgHead.code = 'H'.concat((i + 1).toString());
        mockOrgHead.name = 'Head '.concat(mockOrgHead.code);
        mockOrgHead.managerId = MockUserAdmin.id;
        mockOrgHead.manager = MockUserAdmin;
        // TODO Be careful with recursively forever (stack overflow)
        // mockOrgHead.parent = undefined;
        // mockOrgHead.children = [];
        mockOrganization.push(mockOrgHead);

        for (let j: number = 0; j < MAXIMUM_MOCK_ORGANIZATION_BRANCH; j++) {
            let mockOrgBranch: IOrganization;
            mockOrgBranch = ObjectUtils.deepCopy(MockOrganizationBranchTemplate);
            mockOrgBranch.id = IdGenerators.oid.generate();
            mockOrgBranch.code = 'H'.concat((i + 1).toString(), 'B', (j + 1).toString());
            mockOrgBranch.name = 'Branch '.concat(mockOrgBranch.code);
            mockOrgBranch.managerId = MockUserAdmin.id;
            mockOrgBranch.manager = MockUserAdmin;
            mockOrgBranch.parentId = mockOrgHead.id;
            // TODO Be careful with recursively forever (stack overflow)
            // mockOrgBranch.parent = mockOrgHead;
            // mockOrgBranch.children = [];
            // mockOrgHead.children.push(mockOrgBranch);
            mockOrganization.push(mockOrgBranch);

            for (let k: number = 0; k < MAXIMUM_MOCK_ORGANIZATION_DEPARTMENT; k++) {
                let mockOrgDept: IOrganization;
                mockOrgDept = ObjectUtils.deepCopy(MockOrganizationDepartmentTemplate);
                mockOrgDept.id = IdGenerators.oid.generate();
                mockOrgDept.code = 'H'.concat((i + 1).toString(), 'B', (j + 1).toString(), 'D', (k + 1).toString());
                mockOrgDept.name = 'Department '.concat(mockOrgDept.code);
                mockOrgDept.managerId = MockUserAdmin.id;
                mockOrgDept.manager = MockUserAdmin;
                mockOrgDept.parentId = mockOrgBranch.id;
                // TODO Be careful with recursively forever (stack overflow)
                // mockOrgDept.parent = mockOrgBranch;
                // mockOrgBranch.children.push(mockOrgDept);
                mockOrganization.push(mockOrgDept);
            }
        }
    }
    return mockOrganization;
}

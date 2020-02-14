import ObjectUtils from '../../utils/object.utils';
import {IdGenerators} from '../../config/generator.config';
import {IOrganization, ORGANIZTAION_TYPE} from '../data/organization';

export const MAXIMUM_MOCK_ORGANIZATION_HEAD: number = 10;
export const MAXIMUM_MOCK_ORGANIZATION_BRANCH: number = 10;
export const MAXIMUM_MOCK_ORGANIZATION_DEPARTMENT: number = 20;

export const MockOrganizationHeadTemplate: IOrganization = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: ORGANIZTAION_TYPE.HEAD_CENTER,
};

export const MockOrganizationBranchTemplate: IOrganization = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: ORGANIZTAION_TYPE.BRANCH,
};

export const MockOrganizationDepartmentTemplate: IOrganization = {
    id: 'id',
    code: 'Code',
    name: 'Name',
    type: ORGANIZTAION_TYPE.DEPARTMENT,
};

export function organizationGenerate(): IOrganization[] {
    let mockOrganization: IOrganization[];
    mockOrganization = [];
    for (let i: number = 0; i < MAXIMUM_MOCK_ORGANIZATION_HEAD; i++) {
        let mockOrgHead: IOrganization;
        mockOrgHead = ObjectUtils.deepCopy(MockOrganizationHeadTemplate);
        mockOrgHead.id = IdGenerators.oid.generate();
        mockOrgHead.code = 'HEAD-'.concat((i + 1).toString());
        mockOrgHead.name = 'Head '.concat((i + 1).toString());
        mockOrgHead.children = [];
        mockOrganization.push(mockOrgHead);

        for (let j: number = 0; j < MAXIMUM_MOCK_ORGANIZATION_BRANCH; j++) {
            let mockOrgBranch: IOrganization;
            mockOrgBranch = ObjectUtils.deepCopy(MockOrganizationBranchTemplate);
            mockOrgBranch.id = IdGenerators.oid.generate();
            mockOrgBranch.code = 'BRANCH-'.concat((j + 1).toString());
            mockOrgBranch.name = 'Branch '.concat((j + 1).toString());
            mockOrgBranch.parentId = mockOrgHead.id;
            // TODO Be careful with recursively forever (stack overflow)
            // mockOrgBranch.parent = mockOrgHead;
            mockOrgBranch.children = [];
            mockOrgHead.children.push(mockOrgBranch);

            for (let k: number = 0; k < MAXIMUM_MOCK_ORGANIZATION_DEPARTMENT; k++) {
                let mockOrgDept: IOrganization;
                mockOrgDept = ObjectUtils.deepCopy(MockOrganizationDepartmentTemplate);
                mockOrgDept.id = IdGenerators.oid.generate();
                mockOrgDept.code = 'DEPT-'.concat((k + 1).toString());
                mockOrgDept.name = 'Department '.concat((k + 1).toString());
                mockOrgDept.parentId = mockOrgBranch.id;
                // TODO Be careful with recursively forever (stack overflow)
                // mockOrgDept.parent = mockOrgBranch;
                mockOrgBranch.children.push(mockOrgDept);
            }
        }
    }
    return mockOrganization;
}

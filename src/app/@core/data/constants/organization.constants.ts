export namespace Constants {
    export namespace OrganizationConstants {
        export enum ORGANIZATION_TYPE {
            HEAD_CENTER = 'common.enum.organizationType.head',
            BRANCH = 'common.enum.organizationType.branch',
            DIVISION = 'common.enum.organizationType.division',
            UNIT = 'common.enum.organizationType.unit',
            DEPARTMENT = 'common.enum.organizationType.department',
            TEAM_GROUP = 'common.enum.organizationType.team_group',
        }

        export function convertOrganizationTypeToDisplay(value: ORGANIZATION_TYPE): string {
            switch (value) {
                case ORGANIZATION_TYPE.HEAD_CENTER:
                    return 'common.enum.organizationType.head';
                case ORGANIZATION_TYPE.BRANCH:
                    return 'common.enum.organizationType.branch';
                case ORGANIZATION_TYPE.DIVISION:
                    return 'common.enum.organizationType.division';
                case ORGANIZATION_TYPE.UNIT:
                    return 'common.enum.organizationType.unit';
                case ORGANIZATION_TYPE.DEPARTMENT:
                    return 'common.enum.organizationType.department';
                default:
                    return 'common.enum.organizationType.team_group';
            }
        }
    }
}

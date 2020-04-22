export namespace Constants {
    export namespace OrganizationConstants {
        export const enum ORGANIZATION_TYPE {
            HEAD_CENTER,
            BRANCH,
            DIVISION,
            UNIT,
            DEPARTMENT,
            TEAM_GROUP,
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

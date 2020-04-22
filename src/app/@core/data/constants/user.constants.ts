export namespace Constants {
    export namespace UserConstants {
        export const enum USER_STATUS {
            NOT_ACTIVATED,
            ACTIVATED,
            LOCKED,
        }

        export function convertUserStatusToDisplay(value: USER_STATUS): string {
            switch (value) {
                case USER_STATUS.ACTIVATED:
                    return 'common.enum.userStatus.activated';
                case USER_STATUS.LOCKED:
                    return 'common.enum.userStatus.locked';
                default:
                    return 'common.enum.userStatus.notActivated';
            }
        }
    }
}

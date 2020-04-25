export namespace Constants {
    export namespace UserConstants {
        export enum USER_STATUS {
            NOT_ACTIVATED = 'common.enum.userStatus.notActivated',
            ACTIVATED = 'common.enum.userStatus.activated',
            LOCKED = 'common.enum.userStatus.locked',
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

export namespace Constants {
    export namespace CustomerConstants {
        export const enum CUSTOMER_STATUS {
            NOT_ACTIVATED,
            ACTIVATED,
            LOCKED,
        }

        export const enum CUSTOMER_TYPE {
            CUSTOMER,
            VENDOR,
            ALL,
        }

        export const enum CUSTOMER_LEVEL {
            NEW,
            BRONZE,
            SILVER,
            GOLD,
            PLATINUM,
        }

        export function convertCustomerStatusToDisplay(value: CUSTOMER_STATUS): string {
            switch (value) {
                case CUSTOMER_STATUS.ACTIVATED:
                    return 'common.enum.customerStatus.activated';
                case CUSTOMER_STATUS.LOCKED:
                    return 'common.enum.customerStatus.locked';
                default:
                    return 'common.enum.customerStatus.notActivated';
            }
        }

        export function convertCustomerTypeToDisplay(value: CUSTOMER_TYPE): string {
            switch (value) {
                case CUSTOMER_TYPE.CUSTOMER:
                    return 'common.enum.customerType.customer';
                case CUSTOMER_TYPE.VENDOR:
                    return 'common.enum.customerType.vendor';
                default:
                    return 'common.enum.customerType.all';
            }
        }

        export function convertCustomerLevelToDisplay(value: CUSTOMER_LEVEL): string {
            switch (value) {
                case CUSTOMER_LEVEL.BRONZE:
                    return 'common.enum.customerLevel.bronze';
                case CUSTOMER_LEVEL.SILVER:
                    return 'common.enum.customerLevel.silver';
                case CUSTOMER_LEVEL.GOLD:
                    return 'common.enum.customerLevel.gold';
                case CUSTOMER_LEVEL.PLATINUM:
                    return 'common.enum.customerLevel.platinum';
                default:
                    return 'common.enum.customerLevel.new';
            }
        }
    }
}

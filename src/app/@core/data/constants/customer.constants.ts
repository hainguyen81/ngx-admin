export namespace Constants {
    export namespace CustomerConstants {
        export enum CUSTOMER_STATUS {
            NOT_ACTIVATED = 'common.enum.customerStatus.notActivated',
            ACTIVATED = 'common.enum.customerStatus.activated',
            LOCKED = 'common.enum.customerStatus.locked',
        }

        export enum CUSTOMER_TYPE {
            CUSTOMER = 'common.enum.customerType.customer',
            VENDOR = 'common.enum.customerType.vendor',
            ALL = 'common.enum.customerType.all',
        }

        export enum CUSTOMER_LEVEL {
            NEW = 'common.enum.customerLevel.new',
            BRONZE = 'common.enum.customerLevel.bronze',
            SILVER = 'common.enum.customerLevel.silver',
            GOLD = 'common.enum.customerLevel.gold',
            PLATINUM = 'common.enum.customerLevel.platinum',
        }
    }
}

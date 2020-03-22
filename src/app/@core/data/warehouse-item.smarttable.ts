import { IModel } from './base';

export const enum WarehouseItemSmartTable_STATUS {
    NOT_ACTIVATED,
    ACTIVATED,
    LOCKED,
}

export function convertWarehouseItemSmartTableStatusToDisplay(value: WarehouseItemSmartTable_STATUS): string {
    switch (value) {
        case WarehouseItemSmartTable_STATUS.ACTIVATED:
            return 'common.enum.WarehouseItemSmartTableStatus.activated';
        case WarehouseItemSmartTable_STATUS.LOCKED:
            return 'common.enum.WarehouseItemSmartTableStatus.locked';
        default:
            return 'common.enum.WarehouseItemSmartTableStatus.notActivated';
    }
}

export interface IWarehouseItemSmartTable extends IModel {
    warehouseItemSmartTableName: string;
    email: string;
    tel?: string | null;
    address?: string | null;
    status: WarehouseItemSmartTable_STATUS;
}

export default class WarehouseItemSmartTable implements IWarehouseItemSmartTable {
    constructor(
        public id: string,
        public warehouseItemSmartTableName: string,
        public email: string,
        public status: WarehouseItemSmartTable_STATUS,
        public tel?: string,
        public address?: string,
    ) {}
}

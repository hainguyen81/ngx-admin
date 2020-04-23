import BaseModel, {IModel} from '../base';
import {Constants} from '../constants/warehouse.settings.constants';
import SETTINGS_TYPE = Constants.WarehouseSettingsConstants.SETTINGS_TYPE;

export interface IWarehouseSetting extends IModel {
    code: string;
    name: string;
    type?: SETTINGS_TYPE | SETTINGS_TYPE.OTHERS;
    image?: string[] | null;
    order?: number | 0;
    remark?: string | null;
}

export default class WarehouseSettings extends BaseModel implements IWarehouseSetting {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}

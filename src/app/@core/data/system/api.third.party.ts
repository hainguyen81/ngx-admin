import BaseModel, {IModel} from '../base';
import {THIRD_PARTY_API} from '../../../config/third.party.api';

export interface IApiThirdParty extends IModel {
    code: string;
    response?: string | null;
}

export default class ApiThirdParty extends BaseModel implements IApiThirdParty {
    constructor(public id: string, public code: string) {
        super(id);
    }
}

export class UniversalApiThirdParty extends ApiThirdParty {
    constructor() {
        super(null, THIRD_PARTY_API.universal.code);
    }
}

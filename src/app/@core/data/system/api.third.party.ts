import {IModel} from '../base';
import {API} from '../../../config/api.config';

export interface IApiThirdParty extends IModel {
    code: string;
    response?: string | null;
    expiredAt?: number | null;
}

export default class ApiThirdParty implements IApiThirdParty {
    constructor(public id: string, public code: string,
                public response?: string | null, public expiredAt?: number | null) {
    }
}

export class UniversalApiThirdParty extends ApiThirdParty {
    constructor() {
        super(null, API.third_party.universal.code);
    }
}

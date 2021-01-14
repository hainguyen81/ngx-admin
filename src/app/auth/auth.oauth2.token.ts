import {NbAuthOAuth2Token} from '@nebular/auth';
import JsonUtils from '../utils/common/json.utils';
import {IUser} from '../@core/data/system/user';
import {Constants as CommonConstants} from '../@core/data/constants/common.constants';
import ObjectUtils from '../utils/common/object.utils';
import STATUS = CommonConstants.COMMON.STATUS;

export class NbxAuthOAuth2Token extends NbAuthOAuth2Token {

    constructor(data: { [key: string]: string | number } | string,
                ownerStrategyName: string, createdAt?: Date) {
        super(JsonUtils.parseFisrtResponseJson(data), ownerStrategyName, createdAt);
    }

    isValid(): boolean {
        if (!super.isValid()) {
            return false;
        }
        const user: IUser = super.getPayload() as IUser;
        return (user && user.status === Object.keys(STATUS).find(key => ObjectUtils.requireValue(STATUS, key) === STATUS.ACTIVATED));
    }
}

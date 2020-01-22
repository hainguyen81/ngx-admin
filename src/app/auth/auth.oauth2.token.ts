import {NbAuthOAuth2Token} from '@nebular/auth';
import JsonUtils from '../utils/json.utils';
import {IUser, USER_STATUS} from '../@core/data/user';

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
        return (user && user.status === USER_STATUS.ACTIVATED);
    }
}

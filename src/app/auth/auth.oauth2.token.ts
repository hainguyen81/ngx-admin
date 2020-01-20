import {NbAuthOAuth2Token} from '@nebular/auth';
import JsonUtils from '../utils/json.utils';

export class NbxAuthOAuth2Token extends NbAuthOAuth2Token {

  constructor(data: {[key: string]: string | number} | string,
              ownerStrategyName: string, createdAt?: Date) {
    super(JsonUtils.parseFisrtResponseJson(data), ownerStrategyName, createdAt);
  }
}

import {IApiThirdParty} from '../../../@core/data/system/api.third.party';
import {Type} from '@angular/core';
import {IThirdPartyApiDataParser, IThirdPartyApiDataParserDefinition} from '../third.party.api.datasource';
import {IModel} from '../../../@core/data/base';
import JsonUtils from '../../../utils/common/json.utils';
import ArrayUtils from '../../../utils/common/array.utils';
import AssertUtils from '@app/utils/common/assert.utils';

/**
 * Default third-party API data parser definition
 */
export class ThirdPartyApiDataParserDefinition<T extends IApiThirdParty>
    implements IThirdPartyApiDataParserDefinition<T> {

    constructor(public parsers: { provide: Type<any>; parser: IThirdPartyApiDataParser<T, any> }[]) {
    }
}

/**
 * Abstract third-party API data parser
 */
export abstract class AbstractThirdPartyApiDataParser<T extends IApiThirdParty, K extends IModel>
    implements IThirdPartyApiDataParser<T, K> {

    get dataPropertyName() {
        return this._dataPropertyName;
    }

    protected constructor(private _dataPropertyName: string) {
        AssertUtils.isTrueValue((_dataPropertyName || '').length > 0,
            'Please define the property of the returned third-part API data to parse');
    }

    parse(data: T): K[] {
        let parsedData: K[];
        parsedData = null;
        if (!data || !(data.response || '').length) return parsedData;
        let receivedEntities: any[];
        receivedEntities = JsonUtils.parseResponseJson((<IApiThirdParty>data).response);
        if (receivedEntities && !ArrayUtils.isArray(receivedEntities)) {
            receivedEntities = [receivedEntities];
        }
        if (ArrayUtils.isArray(receivedEntities) && receivedEntities.length) {
            parsedData = [];
            receivedEntities.forEach(receiveEntity => {
                if (receiveEntity && receiveEntity.hasOwnProperty(this.dataPropertyName)
                    && (receiveEntity[this.dataPropertyName] || '').length) {
                    const mappedData: K = this.mappingData(receiveEntity);
                    mappedData && parsedData.push(mappedData);
                    !mappedData && window.console.warn(
                        ['Could not parse ', receiveEntity, ' data from third-party API!']);
                }
            });
        }
        return parsedData;
    }

    protected abstract mappingData(entity: any): K;
}

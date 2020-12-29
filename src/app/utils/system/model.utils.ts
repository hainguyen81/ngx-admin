import {IModel} from '../../@core/data/base';
import {TranslateService} from '@ngx-translate/core';
import ObjectUtils from '../common/object.utils';

/**
 * {IModel} utilities
 */
export default class ModelUtils {

    /**
     * Map the specified {IModel} array to the select option {NgxSelectOption} array
     * @param models {IModel[]}
     * @param translateService {TranslateService}
     * @param includedCode specify whether including model code in text
     * @param keysMapper mappers to map model to option value key
     */
    public static buildModelsForSelectOptions<T extends IModel>(
        models: T[], translateService?: TranslateService | null, includedCode?: boolean | true,
        keysMapper?: { [key: string]: (model: T) => string | string[] | T } | null): T[] {
        if (Object.keys(keysMapper).length) {
            (models || []).forEach((model: T) => {
                for (const [key, mapper] of Object.entries(keysMapper)) {
                    if ((key || '').length && ObjectUtils.isNotNou(mapper)) {
                        ObjectUtils.any(model)[key] = mapper.apply(this, [model]);
                    }
                }
            });
        }
        return models;
    }
    /**
     * Map the specified {IModel} array to the select option {NgxSelectOption} array
     * @param models {IModel[]}
     * @param translateService {TranslateService}
     * @param includedCode specify whether including model code in text
     */
    public static buildModelsForDefaultSelectOptions<T extends IModel>(
        models: T[], translateService?: TranslateService | null, includedCode?: boolean | true): T[] {
        const titleTextMapper: (model: T) => string | string[] | T = model => {
            const modelName: string = ObjectUtils.any(model)['name'] || '';
            const modelCode: string =
                ((ObjectUtils.any(model)['code'] || '').length ? ''.concat('(', ObjectUtils.any(model)['code'], ')') : '');
            if (includedCode) {
                return [(translateService ? translateService.instant(modelName) : modelName),
                    modelCode].join(' ').trim();
            } else {
                return (translateService ? translateService.instant(modelName) : modelName);
            }
        };
        return this.buildModelsForSelectOptions(
            models, translateService, includedCode, {
                'title': titleTextMapper,
                'text': titleTextMapper,
            });
    }

    /**
     * Map the specified {IModel} array to the table column select options array
     * @param models {IModel[]}
     * @param translateService {TranslateService}
     * @param includedCode specify whether including model code in text
     * @param keysMapper mappers to map model to option value key
     */
    public static buildModelsForTableSelectOptions<T extends IModel>(
        models: T[], translateService?: TranslateService | null, includedCode?: boolean | true,
        keysMapper?: { [key: string]: (model: T) => string | string[] | T } | null):
        { [key: string]: string | string[] | T; }[] {
        const options: { [key: string]: string | string[]; }[] = [];
        if (Object.keys(keysMapper).length) {
            (models || []).forEach((model: T) => {
                const option: { [key: string]: string | string[]; } = {};
                for (const [key, mapper] of Object.entries(keysMapper)) {
                    if ((key || '').length && ObjectUtils.isNotNou(mapper)) {
                        option[key] = mapper.apply(this, [model]);
                    }
                }
                options.push(option);
            });
        }
        return options;
    }
    /**
     * Map the specified {IModel} array to the table column select options array
     * @param models {IModel[]}
     * @param translateService {TranslateService}
     * @param includedCode specify whether including model code in text
     */
    public static buildModelsForDefaultTableSelectOptions<T extends IModel>(
        models: T[], translateService?: TranslateService | null, includedCode?: boolean | true):
        { [key: string]: string | string[] | T; }[] {
        const labelTitleTextMapper: (model: T) => string | string[] | T = model => {
            if (includedCode) {
                return translateService ? translateService.instant(ObjectUtils.any(model)['name'])
                    .concat(' (', ObjectUtils.any(model)['code'], ')') : ObjectUtils.any(model)['name'].concat(' (', ObjectUtils.any(model)['code'], ')');
            } else {
                return translateService ? translateService.instant(ObjectUtils.any(model)['name']) : ObjectUtils.any(model)['name'];
            }
        };
        return this.buildModelsForTableSelectOptions(
            models, translateService, includedCode, {
                'value': model => ObjectUtils.any(model)['code'],
                'label': labelTitleTextMapper,
                'title': labelTitleTextMapper,
                'text': labelTitleTextMapper,
                'model': model => model,
            });
    }
}

import {IModel} from '../../@core/data/base';
import {TranslateService} from '@ngx-translate/core';

/**
 * {IModel} utilities
 */
export default class ModelUtils {

    /**
     * Map the specified {IModel} array to the select option {NgxSelectOption} array
     * @param models {IModel[]}
     * @param translateService {TranslateService}
     * @param includedCode specify whether including model code in text
     */
    public static buildModelsForSelectOption<T extends IModel>(
        models: T[], translateService?: TranslateService | null, includedCode?: boolean | true): T[] {
        (models || []).forEach((model: T) => {
            const modelName: string = model['name'] || '';
            const modelCode: string =
                ((model['code'] || '').length ? ''.concat('(', model['code'], ')') : '');
            if (includedCode) {
                model['text'] = [(translateService ? translateService.instant(modelName) : modelName), modelCode].join(' ').trim();
            } else {
                model['text'] = (translateService ? translateService.instant(modelName) : modelName);
            }
        });
        return models;
    }
}

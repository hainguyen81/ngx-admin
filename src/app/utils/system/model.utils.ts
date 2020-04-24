import {IModel} from '../../@core/data/base';

/**
 * {IModel} utilities
 */
export default class ModelUtils {

    /**
     * Map the specified {IModel} array to the select option {NgxSelectOption} array
     * @param models {IModel[]}
     */
    public static buildModelForSelectOption<T extends IModel>(models: T[], includedCode?: boolean | true): T[] {
        (models || []).forEach((model: T) => {
            const modelName: string = model['name'] || '';
            const modelCode: string =
                ((model['code'] || '').length ? ''.concat('(', model['code'], ')') : '');
            if (includedCode) {
                model['text'] = [modelName, modelCode].join(' ').trim();
            } else {
                model['text'] = modelName;
            }
        });
        return models;
    }
}

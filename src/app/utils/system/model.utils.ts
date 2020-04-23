import {IModel} from '../../@core/data/base';

/**
 * {IModel} utilities
 */
export default class ModelUtils {

    /**
     * Map the specified {IModel} array to the select option {NgxSelectOption} array
     * @param models {IModel[]}
     */
    public static buildModelForSelectOption(models: IModel[], includedCode?: boolean | true): IModel[] {
        (models || []).forEach((model: IModel) => {
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
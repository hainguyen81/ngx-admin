import {Component, Inject, Renderer2} from '@angular/core';
import {AppFormlySelectExFieldComponent} from '../../components/app.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {ICountry} from '../../../../../@core/data/system/country';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {NGXLogger} from 'ngx-logger';
import Province, {IProvince} from '../../../../../@core/data/system/province';
import {ProvinceDatasource} from '../../../../../services/implementation/system/province/province.datasource';

export const AppProvincesSelectOptions: INgxSelectExOptions = Object.assign({
    /**
     * Provide an opportunity to change the name an id property of objects in the items
     * {string}
     */
    optionValueField: 'id',
    /**
     * Provide an opportunity to change the name a text property of objects in the items
     * {string}
     */
    optionTextField: 'text',
    /**
     * Specify whether using image for option
     * {boolean}
     */
    enableOptionImage: false,
}, DefaultNgxSelectOptions);

/**
 * Custom state/province formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-province',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppProvinceFormlySelectExFieldComponent
    extends AppFormlySelectExFieldComponent<IProvince> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectExFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param provinceDataSource {ProvinceDatasource}
     * @param _logger {NGXLogger}
     */
    constructor(@Inject(ProvinceDatasource) private provinceDataSource: ProvinceDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_translateService, _renderer, _logger);
        provinceDataSource || throwError('Could not inject ProvinceDatasource instance');
        super.setConfig(AppProvincesSelectOptions);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    set country(country: ICountry) {
        if (!country || !(country.id || '').length
            || !(country.code || '').length || !(country.name || '').length) {
            this.getItems().clear();

        } else {
            SystemDataUtils.invokeAllProvinces(this.provinceDataSource, country)
                .then(provinces => {
                    let nonProvince: IProvince;
                    nonProvince = new Province(null, null, null);
                    nonProvince['text'] = this.getConfig().placeholder;
                    window.console.error(['Fetch data', provinces]);
                    this.setItems([nonProvince].concat(provinces));
                });
        }
    }

    protected valueFormatter(value: any): any {
        let options: any[];
        options = this.getItems().filter(opt => {
            return (opt && ((opt === value) || (opt[this.getConfig().optionValueField] === value)));
        });
        return options || [];
    }
}

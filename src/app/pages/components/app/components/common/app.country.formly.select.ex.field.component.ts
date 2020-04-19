import {AfterViewInit, Component, Inject, OnInit, Renderer2} from '@angular/core';
import {AppFormlySelectExFieldComponent} from '../../components/app.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {CountryDatasource} from '../../../../../services/implementation/system/country/country.datasource';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import Country, {ICountry} from '../../../../../@core/data/system/country';
import {NGXLogger} from 'ngx-logger';

export const AppCountriesSelectOptions: INgxSelectExOptions = Object.assign({
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
    enableOptionImage: true,
}, DefaultNgxSelectOptions);

/**
 * Custom country formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-country',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppCountryFormlySelectExFieldComponent
    extends AppFormlySelectExFieldComponent<ICountry>
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlyTreeviewDropdownFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param countryDataSource {CountryDatasource}
     * @param _logger {NGXLogger}
     */
    constructor(@Inject(CountryDatasource) private countryDataSource: CountryDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_translateService, _renderer, _logger);
        countryDataSource || throwError('Could not inject CountryDatasource instance');
        super.setConfig(AppCountriesSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        this.countryDataSource.onChanged().subscribe(value => {
            SystemDataUtils.invokeAllCountries(this.countryDataSource)
                .then(countries => {
                    let noneCountry: ICountry;
                    noneCountry = new Country(null, null, null);
                    noneCountry['text'] = this.getConfig().placeholder;
                    this.setItems([noneCountry].concat(countries));
                });
        });
        this.countryDataSource.refresh();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.selectExComponent
        && this.selectExComponent.setOptionImageParser(
            item => (item && item.data
            && (((item.data as ICountry).flag || '').length)
                ? [(item.data as ICountry).flag] : null));
    }

    protected valueFormatter(value: any): any {
        let options: any[];
        options = this.getItems().filter(opt => {
            return (opt && ((opt === value) || (opt[this.getConfig().optionValueField] === value)));
        });
        return options || [];
    }
}

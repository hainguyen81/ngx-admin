import {AfterViewInit, Component, Inject} from '@angular/core';
import {AppFormlySelectExFieldComponent} from '../../components/app.formly.select.ex.field.component';
import {ICity} from '../../../../../@core/data/system/city';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {CountryDatasource} from '../../../../../services/implementation/system/country/country.datasource';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';

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
    extends AppFormlySelectExFieldComponent<ICity>
    implements AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlyTreeviewDropdownFieldComponent} class
     * @param translateService {TranslateService}
     */
    constructor(@Inject(CountryDatasource) private countryDataSource: CountryDatasource,
                @Inject(TranslateService) _translateService: TranslateService) {
        super(_translateService);
        countryDataSource || throwError('Could not inject CountryDatasource instance');
        super.setConfig(AppCountriesSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.countryDataSource.onChanged().subscribe(value => {
            SystemDataUtils.invokeAllCountries(this.countryDataSource)
                .then(countries => this.setItems(countries));
        });
        this.countryDataSource.refresh();
    }
}

import {AfterViewInit, Component, Inject, OnInit, Renderer2} from '@angular/core';
import {AppFormlySelectExFieldComponent} from '../../components/app.formly.select.ex.field.component';
import {ICity} from '../../../../../@core/data/system/city';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {CityDatasource} from '../../../../../services/implementation/system/city/city.datasource';

export const AppCitiesSelectOptions: INgxSelectExOptions = Object.assign({
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
 * Custom city formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-city',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppCityFormlySelectExFieldComponent
    extends AppFormlySelectExFieldComponent<ICity>
    implements AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlyTreeviewDropdownFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param cityDataSource {CityDatasource}
     */
    constructor(@Inject(CityDatasource) private cityDataSource: CityDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2) {
        super(_translateService, _renderer);
        cityDataSource || throwError('Could not inject CityDatasource instance');
        super.setConfig(AppCitiesSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    // ngOnInit(): void {
    //     this.cityDataSource.onChanged().subscribe(value => {
    //         SystemDataUtils.invokeAllCountries(this.countryDataSource)
    //             .then(countries => {
    //                 let noneCountry: ICountry;
    //                 noneCountry = new Country(null, null, null);
    //                 noneCountry['text'] = this.getConfig().placeholder;
    //                 this.setItems([noneCountry].concat(countries));
    //             });
    //     });
    //     this.countryDataSource.refresh();
    // }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.form
        && this.form.valueChanges.subscribe(value => {
            window.console.error(['Value changes -----------------', value]);
        });
    }

    protected valueFormatter(value: any): any {
        let options: any[];
        options = this.getItems().filter(opt => {
            return (opt && ((opt === value) || (opt[this.getConfig().optionValueField] === value)));
        });
        return options || [];
    }
}

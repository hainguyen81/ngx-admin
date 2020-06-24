import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {CountryDatasource} from '../../../../../services/implementation/system/country/country.datasource';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import Country, {ICountry} from '../../../../../@core/data/system/country';
import {NGXLogger} from 'ngx-logger';
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../select/abstract.select.component';
import {AppModuleDataFormlySelectFieldComponent} from './app.module.data.formly.select.field.component';

export const AppCountriesNgxSelectOptions: INgxSelectOptions = Object.assign({}, DefaultNgxSelectOptions, {
    /**
     * Provide an opportunity to change the name an id property of objects in the items
     * {string}
     */
    bindValue: 'id',
    /**
     * Provide an opportunity to change the name a text property of objects in the items
     * {string}
     */
    bindLabel: 'text',
    /**
     * Object property to use for image.
     * Default `image`
     */
    bindImage: 'flag',
    /**
     * Specify whether using image for option
     * {boolean}
     */
    enableImage: true,
});

/**
 * Custom country formly field for selecting special
 */
@Component({
    selector: 'ngx-select-2-app-country',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export class AppCountryFormlySelectFieldComponent
    extends AppModuleDataFormlySelectFieldComponent<ICountry, CountryDatasource>
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get noneOption(): ICountry {
        return new Country(null, null, null);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectExFieldComponent} class
     * @param dataSource {CountryDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(CountryDatasource) dataSource: CountryDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this.config = AppCountriesNgxSelectOptions;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<ICountry[] | ICountry> | Promise<ICountry[] | ICountry> | ICountry[] | ICountry {
        return SystemDataUtils.invokeAllCountries(this.dataSource);
    }
}

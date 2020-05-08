import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {AppFormlySelectExFieldComponent} from './app.formly.select.ex.field.component';
import City, {ICity} from '../../../../../@core/data/system/city';
import {TranslateService} from '@ngx-translate/core';
import {of, throwError} from 'rxjs';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {CityDatasource} from '../../../../../services/implementation/system/city/city.datasource';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {NGXLogger} from 'ngx-logger';
import {IProvince} from '../../../../../@core/data/system/province';

export const AppCitiesSelectOptions: INgxSelectExOptions = Object.assign({}, DefaultNgxSelectOptions, {
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
});

/**
 * Custom city formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-city',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppCityFormlySelectExFieldComponent
    extends AppFormlySelectExFieldComponent<ICity> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectExFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param cityDataSource {CityDatasource}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(CityDatasource) private cityDataSource: CityDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        cityDataSource || throwError('Could not inject CityDatasource instance');
        super.config = AppCitiesSelectOptions;
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    set province(province: IProvince) {
        if (!province || !(province.id || '').length
            || !(province.code || '').length || !(province.name || '').length) {
            this.items.clear();
        } else {
            SystemDataUtils.invokeAllCities(this.cityDataSource, province)
                .then(cities => {
                    let noneCity: ICity;
                    noneCity = new City(null, null, null);
                    noneCity['text'] = this.getConfigValue('placeholder');
                    this.items = [noneCity].concat(cities as ICity[]);
                });
        }
    }
}

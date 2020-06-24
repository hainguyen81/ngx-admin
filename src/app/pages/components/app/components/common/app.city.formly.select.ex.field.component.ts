import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import City, {ICity} from '../../../../../@core/data/system/city';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {DefaultNgxSelectExOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {CityDatasource} from '../../../../../services/implementation/system/city/city.datasource';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {NGXLogger} from 'ngx-logger';
import {IProvince} from '../../../../../@core/data/system/province';
import {
    AppModuleDataFormlySelectExFieldComponent,
} from './app.module.data.formly.select.ex.field.component';

export const AppCitiesSelectOptions: INgxSelectExOptions = Object.assign({}, DefaultNgxSelectExOptions, {
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
    extends AppModuleDataFormlySelectExFieldComponent<ICity, CityDatasource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _province: IProvince;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get noneOption(): ICity {
        return new City(null, null, null);
    }

    get province(): IProvince {
        return this._province;
    }

    set province(_province: IProvince) {
        this._province = _province;
        this.refresh();
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectExFieldComponent} class
     * @param dataSource {CityDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(CityDatasource) dataSource: CityDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this.config = AppCitiesSelectOptions;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<ICity[] | ICity> | Promise<ICity[] | ICity> | ICity[] | ICity {
        const prov: IProvince = this.province;
        if (!prov || !(prov.id || '').length || !(prov.code || '').length || !(prov.name || '').length) {
            return of([this.noneOption]);

        } else {
            return SystemDataUtils.invokeAllCities(this.dataSource, prov);
        }
    }
}

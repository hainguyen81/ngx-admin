import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {ICountry} from '../../../../../@core/data/system/country';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {NGXLogger} from 'ngx-logger';
import Province, {IProvince} from '../../../../../@core/data/system/province';
import {ProvinceDatasource} from '../../../../../services/implementation/system/province/province.datasource';
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../select/abstract.select.component';
import {AppModuleDataFormlySelectFieldComponent} from './app.module.data.formly.select.field.component';

export const AppProvincesNgxSelectOptions: INgxSelectOptions = Object.assign({}, DefaultNgxSelectOptions, {
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
     * Specify whether using image for option
     * {boolean}
     */
    enableImage: false,
});

/**
 * Custom state/province formly field for selecting special
 */
@Component({
    selector: 'ngx-select-2-app-province',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppProvinceFormlySelectFieldComponent
    extends AppModuleDataFormlySelectFieldComponent<IProvince, ProvinceDatasource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _country: ICountry;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get noneOption(): IProvince {
        return new Province(null, null, null);
    }

    get country(): ICountry {
        return this._country;
    }

    set country(_country: ICountry) {
        this._country = _country;
        this.refresh();
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppProvinceFormlySelectFieldComponent} class
     * @param dataSource {ProvinceDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(ProvinceDatasource) dataSource: ProvinceDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef,
            AppProvincesNgxSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<IProvince[] | IProvince>
        | Promise<IProvince[] | IProvince> | IProvince[] | IProvince {
        const country: ICountry = this.country;
        if (!country || !(country.id || '').length || !(country.code || '').length || !(country.name || '').length) {
            return of([this.noneOption]);

        } else {
            return SystemDataUtils.invokeAllProvinces(this.dataSource, country);
        }
    }
}

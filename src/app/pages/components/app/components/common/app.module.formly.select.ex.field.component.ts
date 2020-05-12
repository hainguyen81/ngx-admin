import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {AppFormlySelectExFieldComponent} from './app.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {CountryDatasource} from '../../../../../services/implementation/system/country/country.datasource';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {DefaultNgxSelectExOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {NGXLogger} from 'ngx-logger';
import Module, {IModule} from '../../../../../@core/data/system/module';
import {ModuleDatasource} from '../../../../../services/implementation/module.service';

export const AppModulesSelectOptions: INgxSelectExOptions = Object.assign({}, DefaultNgxSelectExOptions, {
    /**
     * Provide an opportunity to change the name an id property of objects in the items
     * {string}
     */
    optionValueField: 'code',
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
 * Custom module formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-module',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppModuleFormlySelectExFieldComponent
    extends AppFormlySelectExFieldComponent<IModule>
    implements OnInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectExFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param moduleDataSource {ModuleDatasource}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(ModuleDatasource) private moduleDataSource: ModuleDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef,
            AppModulesSelectOptions);
        moduleDataSource || throwError('Could not inject ModuleDatasource instance');
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        this.moduleDataSource.onChanged().subscribe(value => {
            SystemDataUtils.invokeAllModelsAsDefaultSelectOptions(
                this.moduleDataSource, this.translateService).then(modules => {
                    let noneModule: IModule;
                    noneModule = new Module(null, null, null, null);
                    noneModule['text'] = this.getConfigValue('placeholder');
                    this.items = [noneModule].concat(modules as IModule[]);
                });
        });
        this.moduleDataSource.refresh();
    }
}

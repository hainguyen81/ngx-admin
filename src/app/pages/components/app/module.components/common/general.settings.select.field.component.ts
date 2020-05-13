import {
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
import {NGXLogger} from 'ngx-logger';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {throwError} from 'rxjs';
import {IModule} from '../../../../../@core/data/system/module';
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../select/abstract.select.component';
import {
    AppModuleSettingsFormlySelectFieldComponent,
} from '../../components/common/app.module.settings.formly.select.field.component';

export const AppGeneralSettingsNgxSelectOptions: INgxSelectOptions =
    Object.assign({}, DefaultNgxSelectOptions, {
        /**
         * Provide an opportunity to change the name an id property of objects in the items
         * {string}
         */
        bindValue: 'name',
        /**
         * Provide an opportunity to change the name a text property of objects in the items
         * {string}
         */
        bindLabel: 'value',
        /**
         * Specify whether using image for option
         * {boolean}
         */
        enableImage: false,
    });

/**
 * Custom module formly field for selecting general settings
 */
@Component({
    selector: 'ngx-select-2-app-module-general-settings',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export abstract class GeneralSettingsFormlySelectFieldComponent
    extends AppModuleSettingsFormlySelectFieldComponent
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get noneOption(): IGeneralSettings {
        return new GeneralSettings(null, null, null, null);
    }

    set moduleCode(_moduleCode: string) {
        throwError('Not support for changing module code');
    }

    get moduleId(): string {
        throwError('Not support for requiring module identity');
        return undefined;
    }

    set moduleId(_moduleId: string) {
        throwError('Not support for changing module identity');
    }

    set module(_module: IModule) {
        throwError('Not support for changing module');
    }

    /**
     * Define the system settings index name to query settings
     * @return the system settings index name
     */
    protected get dataIndexName(): string {
        return '__general_settings_index_by_module_code';
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {GeneralSettingsFormlySelectFieldComponent} class
     * @param dataSource {GeneralSettingsDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    protected constructor(@Inject(GeneralSettingsDatasource) dataSource: GeneralSettingsDatasource,
                          @Inject(TranslateService) _translateService: TranslateService,
                          @Inject(Renderer2) _renderer: Renderer2,
                          @Inject(NGXLogger) _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this.config = AppGeneralSettingsNgxSelectOptions;
    }
}

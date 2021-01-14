import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, Renderer2, ViewContainerRef,} from '@angular/core';
import {AppModuleSettingsFormlySelectExFieldComponent,} from '../../components/common/app.module.settings.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {GeneralSettingsDatasource,} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {throwError} from 'rxjs';
import {IModule} from '../../../../../@core/data/system/module';
import {DefaultNgxSelectExOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';

export const AppGeneralSettingsSelectOptions: INgxSelectExOptions =
    Object.assign({}, DefaultNgxSelectExOptions, {
        /**
         * Provide an opportunity to change the name an id property of objects in the items
         * {string}
         */
        optionValueField: 'name',
        /**
         * Provide an opportunity to change the name a text property of objects in the items
         * {string}
         */
        optionTextField: 'value',
        /**
         * Specify whether using image for option
         * {boolean}
         */
        enableOptionImage: false,
    });

/**
 * Custom module formly field for selecting general settings
 */
@Component({
    selector: 'ngx-select-ex-app-module-general-settings',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class GeneralSettingsFormlySelectExFieldComponent
    extends AppModuleSettingsFormlySelectExFieldComponent
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
     * Create a new instance of {GeneralSettingsFormlySelectExFieldComponent} class
     * @param dataSource {GeneralSettingsDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(GeneralSettingsDatasource) dataSource: GeneralSettingsDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this.config = AppGeneralSettingsSelectOptions;
    }
}

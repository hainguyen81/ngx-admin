import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, Renderer2, ViewContainerRef,} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DefaultNgxSelectExOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {NGXLogger} from 'ngx-logger';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {GeneralSettingsDatasource,} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {IModule} from '../../../../../@core/data/system/module';
import {AppModuleDataIndexSettingsFormlySelectExFieldComponent,} from './app.module.data.index.formly.select.ex.field.component';

export const AppModuleSettingsSelectOptions: INgxSelectExOptions = Object.assign({}, DefaultNgxSelectExOptions, {
    /**
     * Provide an opportunity to change the name an id property of objects in the items
     * {string}
     */
    optionValueField: 'name',
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
    selector: 'ngx-select-ex-app-module-settings',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppModuleSettingsFormlySelectExFieldComponent
    extends AppModuleDataIndexSettingsFormlySelectExFieldComponent<IGeneralSettings, GeneralSettingsDatasource>
    implements OnInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _moduleId: string;
    private _moduleCode: string;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    public get moduleId(): string {
        return this._moduleId;
    }

    public set moduleId(_moduleId: string) {
        if (this._moduleId !== _moduleId) {
            this._moduleId = _moduleId;
            this.refresh();
        }
    }

    public set module(_module: IModule) {
        if (this._moduleId !== (_module || {})['id']) {
            this._moduleId = _module.id;
            this._moduleCode = _module.code;
            this.refresh();
        }
    }

    public get moduleCode(): string {
        return this._moduleCode;
    }

    public set moduleCode(_moduleCode: string) {
        if (this._moduleCode !== _moduleCode) {
            this._moduleCode = _moduleCode;
            this.refresh();
        }
    }

    protected get noneOption(): IGeneralSettings {
        return new GeneralSettings(null, null, null, null);
    }

    protected get dataIndexName(): string {
        return ((this.moduleId || '').length ? 'module_id'
            : (this.moduleCode || '').length ? 'module_code' : undefined);
    }

    protected get dataIndexKey(): IDBKeyRange {
        return ((this.moduleId || '').length ? IDBKeyRange.only(this.moduleId)
            : (this.moduleCode || '').length ? IDBKeyRange.only(this.moduleCode) : undefined);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectExFieldComponent} class
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
        this.config = AppModuleSettingsSelectOptions;
    }
}

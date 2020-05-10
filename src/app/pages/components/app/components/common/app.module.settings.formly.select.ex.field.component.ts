import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {NGXLogger} from 'ngx-logger';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {IModule} from '../../../../../@core/data/system/module';
import {
    AppModuleDataSettingsFormlySelectExFieldComponent,
} from './app.module.data.formly.select.ex.field.component';

export const AppModuleSettingsSelectOptions: INgxSelectExOptions = Object.assign({}, DefaultNgxSelectOptions, {
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
    extends AppModuleDataSettingsFormlySelectExFieldComponent<
        IGeneralSettings, GeneralSettingsDatasource>
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
            // this.doFilter();
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
        const _noneSettings: IGeneralSettings =
            new GeneralSettings(null, null, null, null);
        _noneSettings['text'] = this.getConfigValue('placeholder');
        return _noneSettings;
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
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef,
            AppModuleSettingsSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<IGeneralSettings[] | IGeneralSettings>
        | Promise<IGeneralSettings[] | IGeneralSettings>
        | IGeneralSettings[] | IGeneralSettings {
        const _dataSource: GeneralSettingsDatasource = this.dataSource;
        if ((this.moduleId || '').length) {
            return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                _dataSource, 'module_id', IDBKeyRange.only(this.moduleId), this.translateService);

        } else if ((this.moduleCode || '').length) {
            return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                _dataSource, 'module_code', IDBKeyRange.only(this.moduleCode), this.translateService);

        } else {
            return [this.noneOption];
        }
    }
}

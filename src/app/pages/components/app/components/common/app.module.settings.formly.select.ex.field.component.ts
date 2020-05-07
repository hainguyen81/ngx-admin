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
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {NGXLogger} from 'ngx-logger';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {IModule} from '../../../../../@core/data/system/module';

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
    extends AppFormlySelectExFieldComponent<IGeneralSettings>
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
            this.doFilter();
        }
    }

    public get moduleCode(): string {
        return this._moduleCode;
    }

    public set moduleCode(_moduleCode: string) {
        if (this._moduleCode !== _moduleCode) {
            this._moduleCode = _moduleCode;
            this.doFilter();
        }
    }

    protected get noneSettings(): IGeneralSettings {
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
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param generalSettingsDataSource {GeneralSettingsDatasource}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(GeneralSettingsDatasource) private generalSettingsDataSource: GeneralSettingsDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        generalSettingsDataSource || throwError('Could not inject GeneralSettingsDatasource instance');
        super.config = AppModuleSettingsSelectOptions;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        this.generalSettingsDataSource.onChanged().subscribe(value => this.doFilter());
        this.generalSettingsDataSource.refresh();
    }

    protected valueFormatter(value: any): any {
        let options: any[];
        options = this.items.filter(opt => {
            return (opt && ((opt === value)
                || (opt[this.getConfigValue('optionValueField')] === value)));
        });
        return options || [];
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    private doFilter(): void {
        if ((this.moduleId || '').length) {
            SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                this.generalSettingsDataSource, 'module_id',
                IDBKeyRange.only(this.moduleId), this.translateService).then(
                    modules => this.items = [this.noneSettings].concat(modules as IGeneralSettings[]));

        } else if ((this.moduleCode || '').length) {
            SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                this.generalSettingsDataSource, 'module_code',
                IDBKeyRange.only(this.moduleCode), this.translateService).then(
                    modules => this.items = [this.noneSettings].concat(modules as IGeneralSettings[]));

        } else {
            this.items = [this.noneSettings];
        }
    }
}

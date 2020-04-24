import {AfterViewInit, Component, Inject, OnInit, Renderer2} from '@angular/core';
import {AppFormlySelectExFieldComponent} from '../../components/app.formly.select.ex.field.component';
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

export const AppModuleSettingsSelectOptions: INgxSelectExOptions = Object.assign({
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
    enableOptionImage: true,
}, DefaultNgxSelectOptions);

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
    implements OnInit, AfterViewInit {

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
        _noneSettings['text'] = this.getConfig().placeholder;
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
     */
    constructor(@Inject(GeneralSettingsDatasource) private generalSettingsDataSource: GeneralSettingsDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_translateService, _renderer, _logger);
        generalSettingsDataSource || throwError('Could not inject GeneralSettingsDatasource instance');
        super.setConfig(AppModuleSettingsSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        this.generalSettingsDataSource.onChanged().subscribe(value => this.doFilter());
        this.generalSettingsDataSource.refresh();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        super.selectExComponent
        && super.selectExComponent.setEnabledItemImage(false);
    }

    protected valueFormatter(value: any): any {
        let options: any[];
        options = this.getItems().filter(opt => {
            return (opt && ((opt === value) || (opt[this.getConfig().optionValueField] === value)));
        });
        return options || [];
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    private doFilter(): void {
        if ((this.moduleId || '').length) {
            SystemDataUtils.invokeDatasourceModelsByDatabaseFilter(
                this.generalSettingsDataSource,
                'module_id', IDBKeyRange.only(this.moduleId),
                this.translateService)
                .then(modules => this.setItems([this.noneSettings].concat(modules as IGeneralSettings[])));

        } else if ((this.moduleCode || '').length) {
            SystemDataUtils.invokeDatasourceModelsByDatabaseFilter(
                this.generalSettingsDataSource,
                'code', IDBKeyRange.only(this.moduleCode),
                this.translateService)
                .then(modules => this.setItems([this.noneSettings].concat(modules as IGeneralSettings[])));

        } else {
            this.setItems([this.noneSettings]);
        }
    }
}

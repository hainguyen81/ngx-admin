import {AfterViewInit, Component, Inject, OnInit, Renderer2} from '@angular/core';
import {AppFormlySelectExFieldComponent} from '../../components/app.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {CountryDatasource} from '../../../../../services/implementation/system/country/country.datasource';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {NGXLogger} from 'ngx-logger';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';

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

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    public get module(): string {
        return this._moduleId;
    }

    public set module(_moduleId: string) {
        this._moduleId = _moduleId;
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
     * @param countryDataSource {CountryDatasource}
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

    private doFilter(): void {
        if ((this.module || '').length) {
            SystemDataUtils.invokeModelsByFilter(
                this.generalSettingsDataSource,
                [{field: 'module_id', search: this.module}],
                true, this.translateService).then(
                modules => this.setItems([this.noneSettings].concat(modules as IGeneralSettings[])));
        } else {
            this.setItems([this.noneSettings]);
        }
    }
}

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
import {
    AppModuleSettingsFormlySelectExFieldComponent,
} from '../../components/common/app.module.settings.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import GeneralSettings, {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {Observable, throwError} from 'rxjs';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {IModule} from '../../../../../@core/data/system/module';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';

export const AppSystemSettingsStatusSelectOptions: INgxSelectExOptions =
    Object.assign({}, DefaultNgxSelectOptions, {
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
 * Custom module formly field for selecting system status
 */
@Component({
    selector: 'ngx-select-ex-app-module-system-status',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class SystemStatusFormlySelectExFieldComponent
    extends AppModuleSettingsFormlySelectExFieldComponent
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get noneOption(): IGeneralSettings {
        return new GeneralSettings(null, null, null, null);
    }

    get moduleCode(): string {
        return MODULE_CODES.SYSTEM;
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

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SystemStatusFormlySelectExFieldComponent} class
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
        this.config = AppSystemSettingsStatusSelectOptions;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<IGeneralSettings[] | IGeneralSettings>
        | Promise<IGeneralSettings[] | IGeneralSettings>
        | IGeneralSettings[] | IGeneralSettings {
        return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
            this.dataSource,
            '__general_settings_index_by_module_code',
            IDBKeyRange.only([this.moduleCode, BUILTIN_CODES.STATUS.code]),
            this.translateService);
    }
}

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
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import {GeneralSystemSettingsFormlySelectFieldComponent} from './general.system.settings.select.field.component';

/**
 * Custom module formly field for selecting general system currency settings
 */
@Component({
    selector: 'ngx-select-2-app-module-general-settings-system-currency',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export class SystemCurrencyFormlySelectFieldComponent
    extends GeneralSystemSettingsFormlySelectFieldComponent
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get dataIndexKey(): IDBKeyRange {
        return IDBKeyRange.only([this.moduleCode, BUILTIN_CODES.CURRENCY.code]);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SystemStatusFormlySelectFieldComponent} class
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
    }
}

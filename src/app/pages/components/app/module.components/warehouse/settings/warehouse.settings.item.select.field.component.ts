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
    WarehouseSettingsDatasource,
} from '../../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {Constants as WHConstants} from '../../../../../../@core/data/constants/warehouse.settings.constants';
import WAREHOUSE_SETTINGS_TYPE = WHConstants.WarehouseSettingsConstants.WAREHOUSE_SETTINGS_TYPE;
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {WarehouseSettingsFormlySelectFieldComponent} from './warehouse.settings.select.field.component';

/**
 * Custom module formly field for selecting general warehouse settings item settings
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS,
    selector: 'ngx-select-2-app-module-general-settings-warehouse-settings-item',
    templateUrl: '../../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../../formly/formly.select.field.component.scss'],
})
export class WarehouseSettingsItemFormlySelectFieldComponent
    extends WarehouseSettingsFormlySelectFieldComponent
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get settingsType(): WAREHOUSE_SETTINGS_TYPE {
        return WAREHOUSE_SETTINGS_TYPE.ITEM_SETTINGS;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SystemStatusFormlySelectFieldComponent} class
     * @param dataSource {WarehouseSettingsDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(WarehouseSettingsDatasource) dataSource: WarehouseSettingsDatasource,
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

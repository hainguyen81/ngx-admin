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
import {
    GeneralWarehouseSettingsFormlySelectExFieldComponent,
} from './general.warehouse.settings.select.ex.field.component';

/**
 * Custom module formly field for selecting general warehouse inventory status settings
 */
@Component({
    selector: 'ngx-select-ex-app-module-general-settings-warehouse-inventory-status',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class WarehouseInventoryStatusFormlySelectExFieldComponent
    extends GeneralWarehouseSettingsFormlySelectExFieldComponent
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get dataIndexKey(): IDBKeyRange {
        return IDBKeyRange.only([this.moduleCode, BUILTIN_CODES.WAREHOUSE_INVENTORY_STATUS.code]);
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
    }
}

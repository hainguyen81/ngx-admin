import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, Renderer2, ViewContainerRef,} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {IWarehouseSetting} from '../../../../../../@core/data/warehouse/warehouse.setting';
import {WarehouseSettingsDatasource,} from '../../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {AppModuleDataIndexSettingsFormlySelectExFieldComponent,} from '../../../components/common/app.module.data.index.formly.select.ex.field.component';
import {$enum} from 'ts-enum-util';
import {Constants as WHConstants} from '../../../../../../@core/data/constants/warehouse.settings.constants';
import {DefaultNgxSelectExOptions, INgxSelectExOptions} from '../../../../select-ex/abstract.select.ex.component';
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import WAREHOUSE_SETTINGS_TYPE = WHConstants.WarehouseSettingsConstants.WAREHOUSE_SETTINGS_TYPE;

export const WarehouseSettingsSelectOptions: INgxSelectExOptions =
    Object.assign({}, DefaultNgxSelectExOptions, {
        /**
         * Provide an opportunity to change the name an id property of objects in the items
         * {string}
         */
        optionValueField: 'code',
        /**
         * Provide an opportunity to change the name a text property of objects in the items
         * {string}
         */
        optionTextField: 'name',
        /**
         * Specify whether using image for option
         * {boolean}
         */
        enableOptionImage: true,
    });

/**
 * Custom module formly field for selecting general warehouse settings brand settings
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS,
    selector: 'ngx-select-ex-app-module-general-settings-warehouse-settings',
    templateUrl: '../../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../../formly/formly.select.ex.field.component.scss'],
})
export class WarehouseSettingsFormlySelectExFieldComponent
    extends AppModuleDataIndexSettingsFormlySelectExFieldComponent<IWarehouseSetting, WarehouseSettingsDatasource>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get dataIndexName(): string {
        return 'type';
    }

    protected get dataIndexKey(): IDBKeyRange {
        return IDBKeyRange.only($enum(WAREHOUSE_SETTINGS_TYPE).getKeyOrThrow(this.settingsType));
    }

    /**
     * Get the settings type enumeration value
     * TODO Children classes should override this property for filtering data
     */
    protected get settingsType(): WAREHOUSE_SETTINGS_TYPE {
        return null;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SystemStatusFormlySelectExFieldComponent} class
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
        this.config = WarehouseSettingsSelectOptions;
    }
}

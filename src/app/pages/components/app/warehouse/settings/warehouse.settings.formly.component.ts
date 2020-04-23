import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppFormlyComponent} from '../../components/app.formly.component';
import {API} from '../../../../../config/api.config';
import {Constants} from '../../../../../@core/data/constants/warehouse.settings.constants';
import SETTINGS_TYPE = Constants.WarehouseSettingsConstants.SETTINGS_TYPE;
import convertWarehouseSettingsTypeToDisplay =
    Constants.WarehouseSettingsConstants.convertWarehouseSettingsTypeToDisplay;
import {IWarehouseSetting} from '../../../../../@core/data/warehouse/warehouse.setting';
import {
    WarehouseSettingsDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {WarehouseSettingsToolbarComponent} from './warehouse.settings.toolbar.component';

/* default warehouse settings formly config */
export const WarehouseSettingsFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse settings formly fields config */
export const WarehouseSettingsFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-8',
                fieldGroupClassName: 'row ml-0 mr-0',
                fieldGroup: [
                    {
                        className: 'w-100',
                        key: 'type',
                        type: 'select',
                        templateOptions: {
                            label: 'warehouse.settings.form.type.label',
                            placeholder: 'warehouse.settings.form.type.placeholder',
                            options: [
                                {
                                    value: null,
                                    label: 'warehouse.settings.form.type.placeholder',
                                },
                                {
                                    value: SETTINGS_TYPE.STATUS,
                                    label: convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.STATUS),
                                },
                                {
                                    value: SETTINGS_TYPE.BRAND,
                                    label: convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.BRAND),
                                },
                                {
                                    value: SETTINGS_TYPE.COLOR,
                                    label: convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.COLOR),
                                },
                                {
                                    value: SETTINGS_TYPE.SIZE,
                                    label: convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.SIZE),
                                },
                                {
                                    value: SETTINGS_TYPE.MATERIAL,
                                    label: convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.MATERIAL),
                                },
                                {
                                    value: SETTINGS_TYPE.OTHERS,
                                    label: convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.OTHERS),
                                },
                            ],
                            required: true,
                        },
                    },
                    {
                        className: 'w-100',
                        key: 'code',
                        type: 'input',
                        templateOptions: {
                            label: 'warehouse.settings.form.code.label',
                            placeholder: 'warehouse.settings.form.code.placeholder',
                            required: true,
                        },
                    },
                    {
                        className: 'w-100',
                        key: 'name',
                        type: 'input',
                        templateOptions: {
                            label: 'warehouse.settings.form.name.label',
                            placeholder: 'warehouse.settings.form.name.placeholder',
                            required: true,
                        },
                    },
                    {
                        className: 'w-50',
                        key: 'order',
                        type: 'input',
                        templateOptions: {
                            label: 'warehouse.settings.form.order.label',
                            placeholder: 'warehouse.settings.form.order.placeholder',
                        },
                    },
                    {
                        className: 'w-100',
                        key: 'remark',
                        type: 'textarea',
                        templateOptions: {
                            label: 'warehouse.settings.form.remark.label',
                            placeholder: 'warehouse.settings.form.remark.placeholder',
                        },
                    },
                ],
            },
            {
                className: 'col-4 images-gallery',
                key: 'image',
                type: 'images-gallery',
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: API.warehouseSettings.code,
    selector: 'ngx-formly-form-app-warehouse-settings',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
    ],
})
export class WarehouseSettingsFormlyComponent
    extends AppFormlyComponent<IWarehouseSetting, WarehouseSettingsDatasource, WarehouseSettingsToolbarComponent> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseSettingsFormlyComponent} class
     * @param dataSource {WarehouseSettingsDatasource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     */
    constructor(@Inject(WarehouseSettingsDatasource) dataSource: WarehouseSettingsDatasource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            WarehouseSettingsToolbarComponent);
        super.setConfig(WarehouseSettingsFormConfig);
        super.setFields(WarehouseSettingsFormFieldsConfig);
    }
}

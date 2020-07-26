import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
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
import {IWarehouse} from '../../../../../@core/data/warehouse/warehouse';
import {WarehouseDatasource} from '../../../../../services/implementation/warehouse/warehouse.storage/warehouse.datasource';
import {
    AppCountryFormlySelectExFieldComponent,
} from '../../components/common/app.country.formly.select.ex.field.component';
import {
    AppProvinceFormlySelectExFieldComponent,
} from '../../components/common/app.province.formly.select.ex.field.component';
import {
    AppCityFormlySelectExFieldComponent,
} from '../../components/common/app.city.formly.select.ex.field.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/validation.utils';
import {$enum} from 'ts-enum-util';
import {Constants as WarehouseStorageConstants} from '../../../../../@core/data/constants/warehouse.storage.constants';
import {
    AppModuleDataIndexSettingsFormlySelectFieldComponent,
} from '../../components/common/app.module.data.index.formly.select.field.component';

/* default warehouse storage formly config */
export const WarehouseStorageFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse storage formly fields config */
export const WarehouseStorageFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-8 category-info',
                fieldGroupClassName: 'row ml-0 mr-0',
                fieldGroup: [
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-1-3 p-0',
                                key: 'type',
                                type: 'ngx-warehouse-storage-type',
                                templateOptions: {
                                    label: 'warehouse.storage.form.type.label',
                                    placeholder: 'warehouse.storage.form.type.placeholder',
                                    required: true,
                                    disabled: false,
                                },
                                expressionProperties: {
                                    'templateOptions.disabled':
                                        model => (!model || !(model['parentId'] || '').length),
                                },
                            },
                            {
                                className: 'w-1-3 pl-3 pr-3',
                                key: 'code',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.storage.form.code.label',
                                    placeholder: 'warehouse.storage.form.code.placeholder',
                                    required: true,
                                    'pattern_code': false,
                                },
                                validators: {
                                    'pattern_code': Validators.pattern(ValidationUtils.VALIDATION_CODE_PATTERN),
                                },
                            },
                            {
                                className: 'w-1-3 p-0',
                                key: 'name',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.storage.form.name.label',
                                    placeholder: 'warehouse.storage.form.name.placeholder',
                                    required: true,
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        key: 'street_address',
                        type: 'textarea',
                        hideExpression: model =>
                            (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                .getKeyOrThrow(WarehouseStorageConstants
                                    .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                        templateOptions: {
                            label: 'warehouse.storage.form.street_address.label',
                            placeholder: 'warehouse.storage.form.street_address.placeholder',
                        },
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-50 pl-0 pr-2',
                                key: 'country_id',
                                type: 'select-ngx-country',
                                hideExpression: model =>
                                    (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                        .getKeyOrThrow(WarehouseStorageConstants
                                            .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                                templateOptions: {
                                    label: 'warehouse.storage.form.country.label',
                                    placeholder: 'warehouse.storage.form.country.placeholder',
                                },
                            },
                            {
                                className: 'w-50 pl-2 pr-0',
                                key: 'province_id',
                                type: 'select-ngx-province',
                                hideExpression: model =>
                                    (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                        .getKeyOrThrow(WarehouseStorageConstants
                                            .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                                templateOptions: {
                                    label: 'warehouse.storage.form.province.label',
                                    placeholder: 'warehouse.storage.form.province.placeholder',
                                    disabled: true,
                                },
                                expressionProperties: {
                                    'templateOptions.disabled':
                                        model => (!model || !(model['country_id'] || '').length),
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-50 pl-0 pr-2',
                                key: 'city_id',
                                type: 'select-ngx-city',
                                hideExpression: model =>
                                    (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                        .getKeyOrThrow(WarehouseStorageConstants
                                            .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                                templateOptions: {
                                    label: 'warehouse.storage.form.city.label',
                                    placeholder: 'warehouse.storage.form.city.placeholder',
                                    disabled: true,
                                },
                                expressionProperties: {
                                    'templateOptions.disabled':
                                        model => (!model || !(model['province_id'] || '').length),
                                },
                            },
                            {
                                className: 'w-50 pl-2 pr-0',
                                key: 'district_id',
                                type: 'select',
                                hideExpression: model =>
                                    (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                        .getKeyOrThrow(WarehouseStorageConstants
                                            .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                                templateOptions: {
                                    label: 'warehouse.storage.form.district.label',
                                    placeholder: 'warehouse.storage.form.district.placeholder',
                                    disabled: true,
                                },
                                expressionProperties: {
                                    'templateOptions.disabled':
                                        model => (!model || !(model['city_id'] || '').length),
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-30 pl-0 pr-2',
                                key: 'zip_code',
                                type: 'input',
                                hideExpression: model =>
                                    (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                        .getKeyOrThrow(WarehouseStorageConstants
                                            .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                                templateOptions: {
                                    label: 'warehouse.storage.form.zip_code.label',
                                    placeholder: 'warehouse.storage.form.zip_code.placeholder',
                                },
                            },
                            {
                                className: 'w-30 pl-1 pr-1',
                                key: 'tel',
                                type: 'input',
                                hideExpression: model =>
                                    (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                        .getKeyOrThrow(WarehouseStorageConstants
                                            .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                                templateOptions: {
                                    label: 'warehouse.storage.form.tel.label',
                                    placeholder: 'warehouse.storage.form.tel.placeholder',
                                },
                            },
                            {
                                className: 'w-30 pl-2 pr-0',
                                key: 'fax',
                                type: 'input',
                                hideExpression: model =>
                                    (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                        .getKeyOrThrow(WarehouseStorageConstants
                                            .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                                templateOptions: {
                                    label: 'warehouse.storage.form.fax.label',
                                    placeholder: 'warehouse.storage.form.fax.placeholder',
                                    options: [],
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        key: 'email',
                        type: 'input',
                        hideExpression: model =>
                            (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                                .getKeyOrThrow(WarehouseStorageConstants
                                    .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
                        templateOptions: {
                            label: 'warehouse.storage.form.email.label',
                            placeholder: 'warehouse.storage.form.email.placeholder',
                        },
                    },
                    {
                        className: 'w-100',
                        key: 'remark',
                        type: 'textarea',
                        templateOptions: {
                            label: 'warehouse.storage.form.remark.label',
                            placeholder: 'warehouse.storage.form.remark.placeholder',
                        },
                    },
                ],
            },
            {
                className: 'col-4 images-gallery',
                key: 'image',
                type: 'images-gallery',
                hideExpression: model =>
                    (model && $enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                        .getKeyOrThrow(WarehouseStorageConstants
                            .WarehouseStorageConstants.STORAGE_TYPE.STORAGE) !== model.type),
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS_STORAGE,
    selector: 'ngx-formly-form-app-warehouse-storage',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
    ],
})
export class WarehouseStorageFormlyComponent
    extends AppFormlyComponent<IWarehouse, WarehouseDatasource>
    implements OnInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseStorageFormlyComponent} class
     * @param dataSource {WarehouseDatasource}
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     */
    constructor(@Inject(WarehouseDatasource) dataSource: WarehouseDatasource,
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.config = WarehouseStorageFormConfig;
        super.fields = WarehouseStorageFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // observer fields for applying values
        this.observeFields();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Observe model fields for applying values
     */
    private observeFields(): void {
        const fields: FormlyFieldConfig[] = this.fields;
        fields[0].expressionProperties = {
            'warehouse_type': (model: IWarehouse) => this.observeTypeField(fields, model),
            'country_id': (model: IWarehouse) => {
                if ((model.country_id || '') !== ((model.country || {})['id'] || '')) {
                    this.observeCountryField(fields, model);
                }
            },
            'province_id': (model: IWarehouse) => {
                if ((model.province_id || '') !== ((model.province || {})['id'] || '')) {
                    this.observeProvinceField(fields, model);
                }
            },
        };
    }

    /**
     * Observe type field to apply model country
     * @param fields to observe
     * @param model form model
     */
    private observeTypeField(fields: FormlyFieldConfig[], model: IWarehouse): void {
        const typeField: FormlyFieldConfig = fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[0];
        const typeFieldComponent: AppModuleDataIndexSettingsFormlySelectFieldComponent<any, any> =
            this.getFormFieldComponent(typeField, AppModuleDataIndexSettingsFormlySelectFieldComponent);
        if (typeFieldComponent) {
            typeFieldComponent.disabledValues = (model.parentId || '').length
                ? [$enum(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE)
                    .getKeyOrThrow(WarehouseStorageConstants.WarehouseStorageConstants.STORAGE_TYPE.STORAGE)] : [];
        }
    }

    /**
     * Observe country field to apply model country
     * @param fields to observe
     * @param model form model
     */
    private observeCountryField(fields: FormlyFieldConfig[], model: IWarehouse): void {
        const countryField: FormlyFieldConfig =
            fields[0].fieldGroup[0].fieldGroup[2].fieldGroup[0];
        const countryFieldComponent: AppCountryFormlySelectExFieldComponent =
            super.getFormFieldComponent(countryField, AppCountryFormlySelectExFieldComponent);
        if (countryFieldComponent) {
            model.country = ((countryFieldComponent.selectedValues || []).length
                ? countryFieldComponent.selectedValues[0] : null);
        } else {
            model.country = null;
        }

        const provinceField: FormlyFieldConfig =
            fields[0].fieldGroup[0].fieldGroup[2].fieldGroup[1];
        const provinceFieldComponent: AppProvinceFormlySelectExFieldComponent =
            super.getFormFieldComponent(provinceField, AppProvinceFormlySelectExFieldComponent);
        if (provinceFieldComponent) {
            provinceFieldComponent.country = model.country;
        }
    }

    /**
     * Observe city field to apply model province
     * @param fields to observe
     * @param model form model
     */
    private observeProvinceField(fields: FormlyFieldConfig[], model: IWarehouse): void {
        const provinceField: FormlyFieldConfig =
            fields[0].fieldGroup[0].fieldGroup[2].fieldGroup[1];
        const provinceFieldComponent: AppProvinceFormlySelectExFieldComponent =
            super.getFormFieldComponent(provinceField, AppProvinceFormlySelectExFieldComponent);
        if (provinceFieldComponent) {
            model.province = ((provinceFieldComponent.selectedValues || []).length
                ? provinceFieldComponent.selectedValues[0] : null);
        } else {
            model.province = null;
        }

        const cityField: FormlyFieldConfig =
            fields[0].fieldGroup[0].fieldGroup[3].fieldGroup[0];
        const cityFieldComponent: AppCityFormlySelectExFieldComponent =
            super.getFormFieldComponent(cityField, AppCityFormlySelectExFieldComponent);
        if (cityFieldComponent) {
            cityFieldComponent.province = model.province;
        }
    }
}

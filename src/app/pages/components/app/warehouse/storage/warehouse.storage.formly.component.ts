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
import {API} from '../../../../../config/api.config';
import {
    AppCountryFormlySelectExFieldComponent,
} from '../../components/common/app.country.formly.select.ex.field.component';
import {
    AppProvinceFormlySelectExFieldComponent,
} from '../../components/common/app.province.formly.select.ex.field.component';
import {
    AppCityFormlySelectExFieldComponent,
} from '../../components/common/app.city.formly.select.ex.field.component';

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
                                className: 'w-50 pl-0 pr-2',
                                key: 'code',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.storage.form.code.label',
                                    placeholder: 'warehouse.storage.form.code.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'w-50 pl-2 pr-0',
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
                                type: 'select-ex-country',
                                templateOptions: {
                                    label: 'warehouse.storage.form.country.label',
                                    placeholder: 'warehouse.storage.form.country.placeholder',
                                },
                            },
                            {
                                className: 'w-50 pl-2 pr-0',
                                key: 'province_id',
                                type: 'select-ex-province',
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
                                type: 'select-ex-city',
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
                                templateOptions: {
                                    label: 'warehouse.storage.form.zip_code.label',
                                    placeholder: 'warehouse.storage.form.zip_code.placeholder',
                                },
                            },
                            {
                                className: 'w-30 pl-1 pr-1',
                                key: 'tel',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.storage.form.tel.label',
                                    placeholder: 'warehouse.storage.form.tel.placeholder',
                                },
                            },
                            {
                                className: 'w-30 pl-2 pr-0',
                                key: 'fax',
                                type: 'input',
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
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [

                        ],
                    },
                    {
                        className: 'w-100',
                        key: 'email',
                        type: 'input',
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
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: API.warehouseStorage.code,
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
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        super.setConfig(WarehouseStorageFormConfig);
        super.setFields(WarehouseStorageFormFieldsConfig);
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
        const fields: FormlyFieldConfig[] = this.getFields();
        fields[0].expressionProperties = {
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
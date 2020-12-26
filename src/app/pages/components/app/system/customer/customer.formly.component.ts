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
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppFormlyComponent} from '../../components/app.formly.component';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import {EmailValidators} from 'ngx-validators';
import {ICustomer} from '../../../../../@core/data/system/customer';
import {
    CustomerDatasource,
} from '../../../../../services/implementation/system/customer/customer.datasource';
import {
    AppCountryFormlySelectExFieldComponent,
} from '../../components/common/app.country.formly.select.ex.field.component';
import {
    AppProvinceFormlySelectExFieldComponent,
} from '../../components/common/app.province.formly.select.ex.field.component';
import {
    AppCityFormlySelectExFieldComponent,
} from '../../components/common/app.city.formly.select.ex.field.component';
import {CustomValidators} from 'ngx-custom-validators';
import {ActivatedRoute, Router} from '@angular/router';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/common/validation.utils';

/* default customer formly config */
export const CustomerFormConfig: FormlyConfig = new FormlyConfig();

/* default customer formly fields config */
export const CustomerFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0 p-0',
        fieldGroup: [
            {
                className: 'col-8 ml-0 mr-0 p-0',
                fieldGroupClassName: 'row ml-0 mr-0 p-0',
                fieldGroup: [
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col-4',
                                key: 'type',
                                type: 'ngx-system-customer-type',
                                templateOptions: {
                                    label: 'system.customer.form.type.label',
                                    placeholder: 'system.customer.form.type.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'level',
                                type: 'ngx-system-customer-level',
                                templateOptions: {
                                    label: 'system.customer.form.level.label',
                                    placeholder: 'system.customer.form.level.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'status',
                                type: 'ngx-system-status',
                                templateOptions: {
                                    label: 'system.customer.form.status.label',
                                    placeholder: 'system.customer.form.status.placeholder',
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'code',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.code.label',
                                    placeholder: 'system.customer.form.code.placeholder',
                                    required: true,
                                    'pattern_code': false,
                                },
                                validators: {
                                    'pattern_code': Validators.pattern(ValidationUtils.VALIDATION_CODE_PATTERN),
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'name',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.name.label',
                                    placeholder: 'system.customer.form.name.placeholder',
                                    required: true,
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col',
                                key: 'address',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.address.label',
                                    placeholder: 'system.customer.form.address.placeholder',
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'country_id',
                                type: 'select-ngx-country',
                                templateOptions: {
                                    label: 'system.customer.form.country.label',
                                    placeholder: 'system.customer.form.country.placeholder',
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'province_id',
                                type: 'select-ngx-province',
                                templateOptions: {
                                    label: 'system.customer.form.state_province.label',
                                    placeholder: 'system.customer.form.state_province.placeholder',
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
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'city_id',
                                type: 'select-ngx-city',
                                templateOptions: {
                                    label: 'system.customer.form.city.label',
                                    placeholder: 'system.customer.form.city.placeholder',
                                    disabled: true,
                                },
                                expressionProperties: {
                                    'templateOptions.disabled':
                                            model => (!model || !(model['province_id'] || '').length),
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'district_id',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.district.label',
                                    placeholder: 'system.customer.form.district.placeholder',
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
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col-4',
                                key: 'zip_code',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.zip_code.label',
                                    placeholder: 'system.customer.form.zip_code.placeholder',
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'tel',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.tel.label',
                                    placeholder: 'system.customer.form.tel.placeholder',
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'fax',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.fax.label',
                                    placeholder: 'system.customer.form.fax.placeholder',
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'email',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.email.label',
                                    placeholder: 'system.customer.form.email.placeholder',
                                },
                                validators: {
                                    validation: [CustomValidators.email, EmailValidators.normal],
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'website',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.website.label',
                                    placeholder: 'system.customer.form.website.placeholder',
                                },
                                validators: {
                                    validation: [CustomValidators.url],
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col-4',
                                key: 'contact_name',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.contact_name.label',
                                    placeholder: 'system.customer.form.contact_name.placeholder',
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'contact_tel',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.contact_tel.label',
                                    placeholder: 'system.customer.form.contact_tel.placeholder',
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'contact_fax',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.contact_fax.label',
                                    placeholder: 'system.customer.form.contact_fax.placeholder',
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col',
                                key: 'remark',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.remark.label',
                                    placeholder: 'system.customer.form.remark.placeholder',
                                },
                            },
                        ],
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
    moduleId: Constants.COMMON.MODULE_CODES.SYSTEM_CUSTOMER,
    selector: 'ngx-formly-form-app-system-customer',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
    ],
})
export class CustomerFormlyComponent
    extends AppFormlyComponent<ICustomer, CustomerDatasource>
    implements OnInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CustomerFormlyComponent} class
     * @param dataSource {CustomerDatasource}
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
    constructor(@Inject(CustomerDatasource) dataSource: CustomerDatasource,
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
        super.config = CustomerFormConfig;
        super.fields = CustomerFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

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
            'country_id': (model: ICustomer) => {
                if ((model.country_id || '') !== ((model.country || {})['id'] || '')) {
                    this.observeCountryField(fields, model);
                }
            },
            'province_id': (model: ICustomer) => {
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
    private observeCountryField(fields: FormlyFieldConfig[], model: ICustomer): void {
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
    private observeProvinceField(fields: FormlyFieldConfig[], model: ICustomer): void {
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

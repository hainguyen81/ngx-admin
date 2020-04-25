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
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import {EmailValidators} from 'ngx-validators';
import {UrlValidator} from 'ngx-custom-validators/src/app/url/directive';
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
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import BaseModel, {IModel} from '../../../../../@core/data/base';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import BUILTIN_CODES = Constants.COMMON.BUILTIN_CODES;
import {
    AppModuleSettingsFormlySelectExFieldComponent,
} from '../../components/common/app.module.settings.formly.select.ex.field.component';
import {isNullOrUndefined} from 'util';

/* default customer formly config */
export const CustomerFormConfig: FormlyConfig = new FormlyConfig();

/* default customer formly fields config */
export const CustomerFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-8',
                fieldGroupClassName: 'row ml-0 mr-0',
                fieldGroup: [
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-30 pl-0 pr-2',
                                key: 'type',
                                type: 'select-ex-general-settings',
                                templateOptions: {
                                    label: 'system.customer.form.type.label',
                                    placeholder: 'system.customer.form.type.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'w-30 pl-1 pr-1',
                                key: 'level',
                                type: 'select-ex-general-settings',
                                templateOptions: {
                                    label: 'system.customer.form.level.label',
                                    placeholder: 'system.customer.form.level.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'w-30 pl-2 pr-0',
                                key: 'status',
                                type: 'select-ex-general-settings',
                                templateOptions: {
                                    label: 'system.customer.form.status.label',
                                    placeholder: 'system.customer.form.status.placeholder',
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
                                key: 'code',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.code.label',
                                    placeholder: 'system.customer.form.code.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'w-50 pl-2 pr-0',
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
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-100',
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
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-50 pl-0 pr-2',
                                key: 'country_id',
                                type: 'select-ex-country',
                                templateOptions: {
                                    label: 'system.customer.form.country.label',
                                    placeholder: 'system.customer.form.country.placeholder',
                                },
                            },
                            {
                                className: 'w-50 pl-2 pr-0',
                                key: 'province_id',
                                type: 'select-ex-province',
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
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-50 pl-0 pr-2',
                                key: 'city_id',
                                type: 'select-ex-city',
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
                                className: 'w-50 pl-2 pr-0',
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
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-30 pl-0 pr-2',
                                key: 'zip_code',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.zip_code.label',
                                    placeholder: 'system.customer.form.zip_code.placeholder',
                                },
                            },
                            {
                                className: 'w-30 pl-1 pr-1',
                                key: 'tel',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.tel.label',
                                    placeholder: 'system.customer.form.tel.placeholder',
                                },
                            },
                            {
                                className: 'w-30 pl-2 pr-0',
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
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-50 pl-0 pr-2',
                                key: 'email',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.email.label',
                                    placeholder: 'system.customer.form.email.placeholder',
                                },
                                validators: {
                                    validation: [EmailValidators.normal],
                                },
                            },
                            {
                                className: 'w-50 pl-2 pr-0',
                                key: 'website',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.website.label',
                                    placeholder: 'system.customer.form.website.placeholder',
                                },
                                validators: {
                                    validation: [UrlValidator],
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
                                key: 'contact_name',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.contact_name.label',
                                    placeholder: 'system.customer.form.contact_name.placeholder',
                                },
                            },
                            {
                                className: 'w-30 pl-1 pr-1',
                                key: 'contact_tel',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.customer.form.contact_tel.label',
                                    placeholder: 'system.customer.form.contact_tel.placeholder',
                                },
                            },
                            {
                                className: 'w-30 pl-2 pr-0',
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
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-100',
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
    moduleId: MODULE_CODES.SYSTEM_CUSTOMER,
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
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        generalSettingsDatasource || throwError('Could not inject GeneralSettingsDatasource instance');
        super.setConfig(CustomerFormConfig);
        super.setFields(CustomerFormFieldsConfig);
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
        const fields: FormlyFieldConfig[] = this.getFields();
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

        SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsSelectOptions(
            this.generalSettingsDatasource, 'module_code',
            IDBKeyRange.only(MODULE_CODES.SYSTEM_SETTINGS), this.getTranslateService()).then(
            (settings: IModel[]) => {
                const levelSettings: IModel[] = [];
                const typeSettings: IModel[] = [];
                const statusSettings: IModel[] = [];
                (settings || []).forEach(setting => {
                    switch ((setting || {})['code'] || '') {
                        case BUILTIN_CODES.CUSTOMER_STATUS:
                            statusSettings.push(setting);
                            break;
                        case BUILTIN_CODES.CUSTOMER_LEVEL:
                            levelSettings.push(setting);
                            break;
                        case BUILTIN_CODES.CUSTOMER_TYPE:
                            typeSettings.push(setting);
                            break;
                    }
                });
                this.observeSettingFields(fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[0], typeSettings);
                this.observeSettingFields(fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[1], levelSettings);
                this.observeSettingFields(fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[2], statusSettings);
            });
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

    /**
     * Observe general settings fields
     * @param field to observe
     * @param options to apply
     */
    private observeSettingFields(field: FormlyFieldConfig, options: IModel[]): void {
        const settingsFieldComponent: AppModuleSettingsFormlySelectExFieldComponent =
            super.getFormFieldComponent(field, AppModuleSettingsFormlySelectExFieldComponent);
        if (!isNullOrUndefined(options)) {
            const noneOption: IModel = new BaseModel(null);
            if (settingsFieldComponent) {
                settingsFieldComponent.setItems([noneOption].concat(options));
            } else {
                settingsFieldComponent.setItems([noneOption]);
            }
        }
    }
}

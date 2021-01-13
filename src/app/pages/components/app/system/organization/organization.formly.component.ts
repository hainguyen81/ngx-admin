import {
    ChangeDetectorRef, Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {
    OrganizationDataSource,
} from '../../../../../services/implementation/system/organization/organization.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {ToastrService} from 'ngx-toastr';
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {EmailValidators} from 'ngx-validators';
import {Lightbox} from 'ngx-lightbox';
import {OrganizationTreeviewConfig} from './organization.treeview.component';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {AppFormlyComponent} from '../../components/app.formly.component';
import {
    AppCountryFormlySelectExFieldComponent,
} from '../../components/common/app.country.formly.select.ex.field.component';
import {
    AppProvinceFormlySelectExFieldComponent,
} from '../../components/common/app.province.formly.select.ex.field.component';
import {
    AppCityFormlySelectExFieldComponent,
} from '../../components/common/app.city.formly.select.ex.field.component';
import {IOrganization} from '../../../../../@core/data/system/organization';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {CustomValidators} from 'ngx-custom-validators';
import PromiseUtils from '../../../../../utils/common/promise.utils';
import {throwError} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/common/validation.utils';

/* default organization formly config */
export const OrganizationFormConfig: FormlyConfig = new FormlyConfig();

/* default organization formly fields config */
export const OrganizationFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col belongTo',
                key: 'parentId',
                type: 'organization-treeview',
                templateOptions: {
                    label: 'system.organization.form.belongTo.label',
                    placeholder: 'system.organization.form.belongTo.placeholder',
                    'config': OrganizationTreeviewConfig,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'type',
                type: 'system-organization-type',
                templateOptions: {
                    label: 'system.organization.form.type.label',
                    placeholder: 'system.organization.form.type.placeholder',
                    options: [],
                    required: true,
                },
            },
            {
                className: 'col-6 manager',
                key: 'managerId',
                type: 'select',
                templateOptions: {
                    label: 'system.organization.form.manager.label',
                    placeholder: 'system.organization.form.manager.placeholder',
                    options: [],
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'code',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.code.label',
                    placeholder: 'system.organization.form.code.placeholder',
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
                    label: 'system.organization.form.name.label',
                    placeholder: 'system.organization.form.name.placeholder',
                    required: true,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'address',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.address.label',
                    placeholder: 'system.organization.form.address.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'country_id',
                type: 'select-ngx-country',
                templateOptions: {
                    label: 'system.organization.form.country.label',
                    placeholder: 'system.organization.form.country.placeholder',
                },
            },
            {
                className: 'col-6',
                key: 'province_id',
                type: 'select-ngx-province',
                templateOptions: {
                    label: 'system.organization.form.state_province.label',
                    placeholder: 'system.organization.form.state_province.placeholder',
                    disabled: true,
                },
                expressionProperties: {
                    'templateOptions.disabled':
                        (model: IOrganization) => (!model || !(model.country_id || '').length),
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'city_id',
                type: 'select-ngx-city',
                templateOptions: {
                    label: 'system.organization.form.city.label',
                    placeholder: 'system.organization.form.city.placeholder',
                    disabled: true,
                },
                expressionProperties: {
                    'templateOptions.disabled':
                        (model: IOrganization) => (!model || !(model.province_id || '').length),
                },
            },
            {
                className: 'col-6',
                key: 'district_id',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.district.label',
                    placeholder: 'system.organization.form.district.placeholder',
                    disabled: true,
                },
                expressionProperties: {
                    'templateOptions.disabled':
                        (model: IOrganization) => (!model || !(model.city_id || '').length),
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'zip_code',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.zip_code.label',
                    placeholder: 'system.organization.form.zip_code.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'tel',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.tel.label',
                    placeholder: 'system.organization.form.tel.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'fax',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.fax.label',
                    placeholder: 'system.organization.form.fax.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'email',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.email.label',
                    placeholder: 'system.organization.form.email.placeholder',
                },
                validators: {
                    validation: [CustomValidators.email, EmailValidators.normal],
                },
            },
            {
                className: 'col-6',
                key: 'tax',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.tax.label',
                    placeholder: 'system.organization.form.tax.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'legal_representative',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.legal_representative.label',
                    placeholder: 'system.organization.form.legal_representative.placeholder',
                },
            },
            {
                className: 'col-6',
                key: 'tel_representative',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.tel_representative.label',
                    placeholder: 'system.organization.form.tel_representative.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'business_license',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.business_license.label',
                    placeholder: 'system.organization.form.business_license.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'business_license_dt',
                type: 'app-date-picker',
                templateOptions: {
                    label: 'system.organization.form.business_license_dt.label',
                    placeholder: 'system.organization.form.business_license_dt.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'date_incorporation',
                type: 'app-date-picker',
                templateOptions: {
                    label: 'system.organization.form.date_incorporation.label',
                    placeholder: 'system.organization.form.date_incorporation.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'bank_company',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.bank_company.label',
                    placeholder: 'system.organization.form.bank_company.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'bank_company_at',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.bank_company_at.label',
                    placeholder: 'system.organization.form.bank_company_at.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'bank_company_account',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.bank_company_account.label',
                    placeholder: 'system.organization.form.bank_company_account.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'remark',
                type: 'textarea',
                templateOptions: {
                    label: 'system.organization.form.remark.label',
                    placeholder: 'system.organization.form.remark.placeholder',
                },
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.SYSTEM_ORGANIZATION,
    selector: 'ngx-formly-form-app-system-organization',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
        './organization.formly.component.scss',
    ],
})
export class OrganizationFormlyComponent
    extends AppFormlyComponent<IOrganization, OrganizationDataSource>
    implements OnInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {OrganizationFormlyComponent} class
     * @param dataSource {OrganizationDataSource}
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
     * @param userDataSource to searching all organization managers
     */
    constructor(@Inject(OrganizationDataSource) dataSource: OrganizationDataSource,
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(UserDataSource) private userDataSource?: UserDataSource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        userDataSource || throwError('Could not inject UserDataSource instance');
        this.config = OrganizationFormConfig;
        this.fields = OrganizationFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // observe belongTo/manager fields
        PromiseUtils.parallelPromises(undefined, undefined, [
            this.observeManagerField(),
        ]).then(value => this.getLogger().debug('Loading parent organization/manager data successful'),
                reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));

        // observe fields for applying values
        this.observeFields();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Observe manager field
     */
    private observeManagerField(): Promise<any> {
        return SystemDataUtils.invokeAllUsersAsSelectOptions(this.userDataSource)
            .then(users => {
                if (this.formlyForm) {
                    this.formlyForm.fields[1].fieldGroup[1].templateOptions.options = users;
                }
            });
    }

    /**
     * Observe model fields for applying values
     */
    private observeFields(): void {
        const fields: FormlyFieldConfig[] = this.fields;
        fields[0].expressionProperties = {
            'country_id': (model: IOrganization) => {
                if ((model.country_id || '') !== ((model.country || {})['id'] || '')) {
                    this.observeCountryField(fields, model);
                }
            },
            'province_id': (model: IOrganization) => {
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
    private observeCountryField(fields: FormlyFieldConfig[], model: IOrganization): void {
        const countryField: FormlyFieldConfig = fields[4].fieldGroup[0];
        const countryFieldComponent: AppCountryFormlySelectExFieldComponent =
            super.getFormFieldComponent(countryField, AppCountryFormlySelectExFieldComponent);
        if (countryFieldComponent) {
            model.country = ((countryFieldComponent.selectedValues || []).length
                ? countryFieldComponent.selectedValues[0] : null);
        } else {
            model.country = null;
        }

        const provinceField: FormlyFieldConfig = fields[4].fieldGroup[1];
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
    private observeProvinceField(fields: FormlyFieldConfig[], model: IOrganization): void {
        const provinceField: FormlyFieldConfig = fields[4].fieldGroup[1];
        const provinceFieldComponent: AppProvinceFormlySelectExFieldComponent =
            super.getFormFieldComponent(provinceField, AppProvinceFormlySelectExFieldComponent);
        if (provinceFieldComponent) {
            model.province = ((provinceFieldComponent.selectedValues || []).length
                ? provinceFieldComponent.selectedValues[0] : null);
        } else {
            model.province = null;
        }

        const cityField: FormlyFieldConfig = fields[5].fieldGroup[0];
        const cityFieldComponent: AppCityFormlySelectExFieldComponent =
            super.getFormFieldComponent(cityField, AppCityFormlySelectExFieldComponent);
        if (cityFieldComponent) {
            cityFieldComponent.province = model.province;
        }
    }
}

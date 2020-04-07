import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseFormlyComponent} from '../../../formly/base.formly.component';
import {OrganizationDataSource} from '../../../../../services/implementation/system/organization/organization.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {
    convertOrganizationTypeToDisplay,
    IOrganization,
    ORGANIZTAION_TYPE,
} from '../../../../../@core/data/system/organization';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {ToastrService} from 'ngx-toastr';
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';
import {IUser} from '../../../../../@core/data/system/user';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {EmailValidators} from 'ngx-validators';
import {Lightbox} from 'ngx-lightbox';
import {OrganizationTreeviewConfig} from './organization.treeview.component';
import OrganizationUtils from '../../../../../utils/system/organization.utils';
import {Observable} from 'rxjs';
import PromiseUtils from '../../../../../utils/promise.utils';
import {FormGroup} from '@angular/forms';
import {FormlyFormOptions} from '@ngx-formly/core/lib/components/formly.field.config';
import {TreeviewItem} from 'ngx-treeview';

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
                type: 'organization-treeview-dropdown',
                templateOptions: {
                    label: 'system.organization.form.belongTo.label',
                    placeholder: 'system.organization.form.belongTo.placeholder',
                    options: [],
                },
                // hooks: {
                //     onInit: (field?: FormlyFieldConfig) => {
                //         field && field.formControl
                //         && field.formControl.valueChanges.subscribe(value => {
                //             if ((field.model as IOrganization) && (value as TreeviewItem)) {
                //                 let item: TreeviewItem;
                //                 item = value as TreeviewItem;
                //                 let orgItem: IOrganization;
                //                 orgItem = (item ? item.value as IOrganization : null);
                //                 (field.model as IOrganization).parentId = (orgItem ? orgItem.id : null);
                //             }
                //         });
                //     },
                // },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'type',
                type: 'select',
                templateOptions: {
                    label: 'system.organization.form.type.label',
                    placeholder: 'system.organization.form.type.placeholder',
                    options: [
                        {
                            value: ORGANIZTAION_TYPE.HEAD_CENTER,
                            label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.HEAD_CENTER),
                        },
                        {
                            value: ORGANIZTAION_TYPE.BRANCH,
                            label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.BRANCH),
                        },
                        {
                            value: ORGANIZTAION_TYPE.DIVISION,
                            label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.DIVISION),
                        },
                        {
                            value: ORGANIZTAION_TYPE.UNIT,
                            label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.UNIT),
                        },
                        {
                            value: ORGANIZTAION_TYPE.DEPARTMENT,
                            label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.DEPARTMENT),
                        },
                        {
                            value: ORGANIZTAION_TYPE.TEAM_GROUP,
                            label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.TEAM_GROUP),
                        },
                    ],
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
                key: 'tel',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.tel.label',
                    placeholder: 'system.organization.form.tel.placeholder',
                },
            },
            {
                className: 'col-6',
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
                    validation: [EmailValidators.normal],
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
                className: 'col-6',
                key: 'business_license',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.business_license.label',
                    placeholder: 'system.organization.form.business_license.placeholder',
                },
            },
            {
                className: 'col-6',
                key: 'business_license_dt',
                type: 'datepicker',
                templateOptions: {
                    label: 'system.organization.form.business_license_dt.label',
                    placeholder: 'system.organization.form.business_license_dt.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'date_incorporation',
                type: 'datepicker',
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
                className: 'col-6',
                key: 'bank_company',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.bank_company.label',
                    placeholder: 'system.organization.form.bank_company.placeholder',
                },
            },
            {
                className: 'col-6',
                key: 'bank_company_at',
                type: 'input',
                templateOptions: {
                    label: 'system.organization.form.bank_company_at.label',
                    placeholder: 'system.organization.form.bank_company_at.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
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
    selector: 'ngx-formly-form-organization',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss', './organization.formly.component.scss'],
})
export class OrganizationFormlyComponent extends BaseFormlyComponent<IOrganization, OrganizationDataSource>
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
                @Inject(UserDataSource) private userDataSource?: UserDataSource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            OrganizationFormConfig, OrganizationFormFieldsConfig);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        this.getFields()[0].fieldGroup[0].templateOptions.options = this.getAllOrganization();
        this.getFields()[1].fieldGroup[1].templateOptions.options = this.getAllUsers();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Get the organization list for options selection
     * @return {Observable}
     */
    private getAllUsers(): Observable<{ value: string, label: string }[]> {
        if (!this.userDataSource) {
            return new Observable<{value: string, label: string}[]>();
        }

        return PromiseUtils.promiseToObservable(
            this.userDataSource.setPaging(1, undefined, false)
                .setFilter([], false, false)
                .getAll().then(userValues => {
                    let options: { value: string, label: string }[];
                    options = [];
                    Array.from(userValues).forEach((userValue: IUser) => {
                        this.mapUserAsOptions(userValue, options);
                    });
                    return options;
                }));
    }

    /**
     * Get the organization list for options selection
     * @return {Observable}
     */
    private getAllOrganization(): Observable<any[]> {
        return PromiseUtils.promiseToObservable(
            this.getDataSource().getAll().then(orgValues => {
                return [OrganizationTreeviewConfig,
                    OrganizationUtils.buildOrganization(orgValues as IOrganization[])];
            }));
    }

    // /**
    //  * Get the organization list for options selection
    //  * @return {Promise}
    //  */
    // private getAllOrganization(): Promise<{ value: string, label: string }[]> {
    //     return this.getDataSource().getAll().then(orgValues => {
    //         if (!isArray(orgValues)) {
    //             orgValues = [ orgValues as IOrganization ];
    //         }
    //         let options: { value: string, label: string }[];
    //         options = [];
    //         Array.from(orgValues).forEach((orgValue: IOrganization) => {
    //             this.mapOrganizationAsOptions(orgValue, options);
    //         });
    //         return options;
    //     });
    // }
    //
    // /**
    //  * Map the specified {IOrganization} into the return options array recursively
    //  * @param orgValue to map
    //  * @param retValues to push returned values
    //  */
    // private mapOrganizationAsOptions(orgValue: IOrganization, retValues: { value: string, label: string }[]): void {
    //     if (!orgValue) {
    //         return;
    //     }
    //
    //     if (!retValues) {
    //         retValues = [];
    //     }
    //     retValues.push({value: orgValue.id, label: orgValue.name});
    //     if (orgValue.children && orgValue.children.length) {
    //         for (const orgChild of orgValue.children) {
    //             this.mapOrganizationAsOptions(orgChild, retValues);
    //         }
    //     }
    // }

    /**
     * Map the specified {IUser} into the return options array recursively
     * @param userValue to map
     * @param retValues to push returned values
     */
    private mapUserAsOptions(userValue: IUser, retValues: { value: string, label: string }[]): void {
        if (!userValue) {
            return;
        }

        if (!retValues) {
            retValues = [];
        }
        let userName: string;
        userName = userValue.username;
        if ((userValue.firstName || '').length || (userValue.lastName || '')) {
            userName = [(userValue.firstName || ''), (userValue.lastName || '')].join(' ').trim();
        }
        retValues.push({value: userValue.id, label: userName});
    }
}

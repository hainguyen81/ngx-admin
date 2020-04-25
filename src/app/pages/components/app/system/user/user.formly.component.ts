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
import {CustomValidators} from 'ngx-custom-validators';
import PromiseUtils from '../../../../../utils/promise.utils';
import {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {IUser} from '../../../../../@core/data/system/user';
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';

/* default user formly config */
export const UserFormConfig: FormlyConfig = new FormlyConfig();

/* default user formly fields config */
export const UserFormFieldsConfig: FormlyFieldConfig[] = [
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
                                className: 'col',
                                key: 'company',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.user.form.company.label',
                                    placeholder: 'system.user.form.company.placeholder',
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
                                className: 'col-6',
                                key: 'username',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.user.form.username.label',
                                    placeholder: 'system.user.form.username.placeholder',
                                    required: true,
                                },
                                validators: [CustomValidators.email, EmailValidators.normal],
                            },
                            {
                                className: 'col-6',
                                key: 'password',
                                type: 'password',
                                templateOptions: {
                                    label: 'system.user.form.password.label',
                                    placeholder: 'system.user.form.password.placeholder',
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
                                className: 'col-6',
                                key: 'firstName',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.user.form.firstName.label',
                                    placeholder: 'system.user.form.firstName.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'lastName',
                                type: 'input',
                                templateOptions: {
                                    label: 'system.user.form.lastName.label',
                                    placeholder: 'system.user.form.lastName.placeholder',
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
                                className: 'col-4',
                                key: 'lang',
                                type: 'select',
                                templateOptions: {
                                    label: 'system.user.form.lang.label',
                                    placeholder: 'system.user.form.lang.placeholder',
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'status',
                                type: 'select-ex-general-settings',
                                templateOptions: {
                                    label: 'system.user.form.status.label',
                                    placeholder: 'system.user.form.status.placeholder',
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'enterprise',
                                type: 'checkbox',
                                templateOptions: {
                                    label: 'system.user.form.enterprise.label',
                                    placeholder: 'system.user.form.enterprise.placeholder',
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
    moduleId: MODULE_CODES.SYSTEM_USER,
    selector: 'ngx-formly-form-app-system-user',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
    ],
})
export class UserFormlyComponent
    extends AppFormlyComponent<IUser, UserDataSource>
    implements OnInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {UserFormlyComponent} class
     * @param dataSource {UserDataSource}
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
    constructor(@Inject(UserDataSource) dataSource: UserDataSource,
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
        super.setConfig(UserFormConfig);
        super.setFields(UserFormFieldsConfig);
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
        // user status
        PromiseUtils.parallelPromises(undefined, undefined, [
            this.observeSettingFieldByCode(
                fields[0].fieldGroup[0].fieldGroup[3].fieldGroup[1], BUILTIN_CODES.USER_STATUS.code),
            ]).then(
                value => this.getLogger().debug('Loading settings successful'),
                reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }

    /**
     * Observe general setting field by setting code
     * @param field to observe
     * @param settingCode to filter
     */
    private observeSettingFieldByCode(field: FormlyFieldConfig, settingCode: string): Promise<void> {
        return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsSelectOptions(
            this.generalSettingsDatasource, '__general_settings_index_by_module_code',
            IDBKeyRange.only([MODULE_CODES.SYSTEM, settingCode]),
            this.getTranslateService(), {
                'text': (model: IGeneralSettings) => this.translate(model.value.toString()),
            }).then((settings: IModel[]) => this.observeSettingField(field, settings));
    }
    /**
     * Observe general settings field
     * @param field to observe
     * @param options to apply
     */
    private observeSettingField(field: FormlyFieldConfig, options: IModel[]): void {
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

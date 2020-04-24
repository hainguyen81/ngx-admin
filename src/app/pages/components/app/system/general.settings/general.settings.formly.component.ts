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
import {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {MODULE_CODES} from '../../../../../config/api.config';

/* default general settings formly config */
export const GeneralSettingsFormConfig: FormlyConfig = new FormlyConfig();

/* default general settings formly fields config */
export const GeneralSettingsFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'module_id',
                type: 'select-ex-module',
                templateOptions: {
                    label: 'system.general.settings.form.module.label',
                    placeholder: 'system.general.settings.form.module.placeholder',
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
                key: 'code',
                type: 'input',
                templateOptions: {
                    label: 'system.general.settings.form.code.label',
                    placeholder: 'system.general.settings.form.code.placeholder',
                    required: true,
                    disabled: true,
                },
                expressionProperties: {
                    'templateOptions.disabled': model => (!model || !(model['module_id'] || '').length),
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'system.general.settings.form.name.label',
                    placeholder: 'system.general.settings.form.name.placeholder',
                    required: true,
                    disabled: true,
                },
                expressionProperties: {
                    'templateOptions.disabled': model => (!model || !(model['module_id'] || '').length),
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'value',
                type: 'input',
                templateOptions: {
                    label: 'system.general.settings.form.value.label',
                    placeholder: 'system.general.settings.form.value.placeholder',
                    required: true,
                    disabled: true,
                },
                expressionProperties: {
                    'templateOptions.disabled': model => (!model || !(model['module_id'] || '').length),
                },
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: MODULE_CODES.SYSTEM_SETTINGS,
    selector: 'ngx-formly-form-app-system-general-settings',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
    ],
})
export class GeneralSettingsFormlyComponent
    extends AppFormlyComponent<IGeneralSettings, GeneralSettingsDatasource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {GeneralSettingsFormlyComponent} class
     * @param dataSource {GeneralSettingsDatasource}
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
    constructor(@Inject(GeneralSettingsDatasource) dataSource: GeneralSettingsDatasource,
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
        super.setConfig(GeneralSettingsFormConfig);
        super.setFields(GeneralSettingsFormFieldsConfig);
    }
}

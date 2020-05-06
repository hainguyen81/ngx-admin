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
import {IWarehouseSetting} from '../../../../../@core/data/warehouse/warehouse.setting';
import {
    WarehouseSettingsDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import PromiseUtils from '../../../../../utils/promise.utils';
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import BUILTIN_CODES = Constants.COMMON.BUILTIN_CODES;
import {ActivatedRoute, Router} from '@angular/router';
import {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/validation.utils';

/* default warehouse settings formly config */
export const WarehouseSettingsFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse settings formly fields config */
export const WarehouseSettingsFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                fieldGroupClassName: 'row ml-0 mr-0',
                fieldGroup: [
                    {
                        className: 'w-100',
                        key: 'type',
                        type: 'select-ex-general-settings',
                        templateOptions: {
                            label: 'warehouse.settings.form.type.label',
                            placeholder: 'warehouse.settings.form.type.placeholder',
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
                        validators: {
                            validation: [Validators.pattern(ValidationUtils.VALIDATION_CODE_PATTERN)],
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
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_GENERAL,
    selector: 'ngx-formly-form-app-warehouse-settings',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
    ],
})
export class WarehouseSettingsFormlyComponent
    extends AppFormlyComponent<IWarehouseSetting, WarehouseSettingsDatasource>
    implements OnInit {

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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     * @param generalSettingsDatasource {GeneralSettingsDatasource}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        generalSettingsDatasource || throwError('Could not inject GeneralSettingsDatasource instance');
        super.config = WarehouseSettingsFormConfig;
        super.fields = WarehouseSettingsFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        const fields: FormlyFieldConfig[] = this.fields;
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultWarehouseGeneralSettingsFormField(
                this.generalSettingsDatasource, fields[0].fieldGroup[0].fieldGroup[0],
                BUILTIN_CODES.WAREHOUSE_SETTINGS_TYPE.code,
                null, this.noneOption as IGeneralSettings),
        ]).then(value => this.getLogger().debug('Loading general settings successful'),
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}

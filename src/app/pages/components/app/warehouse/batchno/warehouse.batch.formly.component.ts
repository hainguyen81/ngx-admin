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
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import {ActivatedRoute, Router} from '@angular/router';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/validation.utils';
import {IWarehouseBatchNo} from '../../../../../@core/data/warehouse/warehouse.batch.no';
import {
    WarehouseBatchNoDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.datasource';
import PromiseUtils from '../../../../../utils/promise.utils';
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';

/* default warehouse batch no formly config */
export const WarehouseBatchNoFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse batch no formly fields config */
export const WarehouseBatchNoFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'code',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.batch_no.form.code.label',
                    placeholder: 'warehouse.batch_no.form.code.placeholder',
                    required: true,
                },
                validators: {
                    validation: [Validators.pattern(ValidationUtils.VALIDATION_CODE_PATTERN)],
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.batch_no.form.name.label',
                    placeholder: 'warehouse.batch_no.form.name.placeholder',
                    required: true,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'mfg_date',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.batch_no.form.mfg_date.label',
                    placeholder: 'warehouse.batch_no.form.mfg_date.placeholder',
                    required: true,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'expiredAt',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.batch_no.form.expiredAt.label',
                    placeholder: 'warehouse.batch_no.form.expiredAt.placeholder',
                    required: true,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'remark',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.batch_no.form.remark.label',
                    placeholder: 'warehouse.batch_no.form.remark.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'status',
                type: 'select-ex-general-settings',
                templateOptions: {
                    label: 'warehouse.batch_no.form.status.label',
                    placeholder: 'warehouse.batch_no.form.status.placeholder',
                    required: true,
                },
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_BATCH,
    selector: 'ngx-formly-form-app-warehouse-batch-no',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
    ],
})
export class WarehouseBatchNoFormlyComponent
    extends AppFormlyComponent<IWarehouseBatchNo, WarehouseBatchNoDatasource>
    implements OnInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseBatchNoFormlyComponent} class
     * @param dataSource {WarehouseBatchNoDatasource}
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
    constructor(@Inject(WarehouseBatchNoDatasource) dataSource: WarehouseBatchNoDatasource,
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
        super.config = WarehouseBatchNoFormConfig;
        super.fields = WarehouseBatchNoFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // observer fields for applying values
        const fields: FormlyFieldConfig[] = this.fields;
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultSystemGeneralSettingsFormField(
                this.generalSettingsDatasource, fields[5].fieldGroup[0],
                BUILTIN_CODES.STATUS.code,
                null, this.noneOption as IGeneralSettings),
        ]).then(value => this.getLogger().debug('Loading general settings successful'),
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}

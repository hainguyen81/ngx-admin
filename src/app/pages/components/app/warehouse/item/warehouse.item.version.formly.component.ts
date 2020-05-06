import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {
    WarehouseItemDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import {AppFormlyComponent} from '../../components/app.formly.component';
import {ActivatedRoute, Router} from '@angular/router';
import PromiseUtils from '../../../../../utils/promise.utils';
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    WarehouseSettingsDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {CustomValidators} from 'ngx-custom-validators';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/validation.utils';

export const WarehouseItemVersionFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse item version formly fields config */
export const WarehouseItemVersionFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'code',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.code.label',
                    placeholder: 'warehouse.item.overview.form.code.placeholder',
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
                className: 'col',
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.name.label',
                    placeholder: 'warehouse.item.overview.form.name.placeholder',
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
                key: 'barcode',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.barcode.label',
                    placeholder: 'warehouse.item.overview.form.barcode.placeholder',
                },
                validators: {
                    validation: [Validators.pattern(/[a-zA-Z0-9]/g)],
                },
            },
            {
                className: 'col-6',
                key: 'number_of_prints',
                type: 'input',
                templateOptions: {
                    type: 'number',
                    label: 'warehouse.item.overview.form.number_of_prints.label',
                    placeholder: 'warehouse.item.overview.form.number_of_prints.placeholder',
                },
                validators: {
                    validation: [CustomValidators.number, CustomValidators.min(0)],
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'dealer_price',
                type: 'input',
                templateOptions: {
                    type: 'number',
                    label: 'warehouse.item.overview.form.dealer_price.label',
                    placeholder: 'warehouse.item.overview.form.dealer_price.placeholder',
                    required: true,
                },
                validators: {
                    validation: [CustomValidators.number, CustomValidators.min(0)],
                },
            },
            {
                className: 'col-6',
                key: 'cost_price',
                type: 'input',
                templateOptions: {
                    type: 'number',
                    label: 'warehouse.item.overview.form.cost_price.label',
                    placeholder: 'warehouse.item.overview.form.cost_price.placeholder',
                    required: true,
                },
                validators: {
                    validation: [CustomValidators.number, CustomValidators.min(0)],
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'selling_price',
                type: 'input',
                templateOptions: {
                    type: 'number',
                    label: 'warehouse.item.overview.form.selling_price.label',
                    placeholder: 'warehouse.item.overview.form.selling_price.placeholder',
                    required: true,
                },
                validators: {
                    validation: [CustomValidators.number, CustomValidators.min(0)],
                },
            },
            {
                className: 'col-6',
                key: 'currency',
                type: 'select-ex-general-settings',
                templateOptions: {
                    label: 'warehouse.item.overview.form.currency.label',
                    placeholder: 'warehouse.item.overview.form.currency.placeholder',
                    required: false,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'length',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.length.label',
                    placeholder: 'warehouse.item.overview.form.length.placeholder',
                    required: false,
                },
            },
            {
                className: 'col-4',
                key: 'width',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.width.label',
                    placeholder: 'warehouse.item.overview.form.width.placeholder',
                    required: false,
                },
            },
            {
                className: 'col-4',
                key: 'height',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.height.label',
                    placeholder: 'warehouse.item.overview.form.height.placeholder',
                    required: false,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'weight',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.weight.label',
                    placeholder: 'warehouse.item.overview.form.weight.placeholder',
                    required: false,
                },
            },
            {
                className: 'col-6',
                key: 'size',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.size.label',
                    placeholder: 'warehouse.item.overview.form.size.placeholder',
                    required: false,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'color',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.color.label',
                    placeholder: 'warehouse.item.overview.form.color.placeholder',
                    required: false,
                },
            },
            {
                className: 'col-6',
                key: 'material',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.material.label',
                    placeholder: 'warehouse.item.overview.form.material.placeholder',
                    required: false,
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-6',
                key: 'unit',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.unit.label',
                    placeholder: 'warehouse.item.overview.form.unit.placeholder',
                    required: false,
                },
            },
            {
                className: 'col-6',
                key: 'rate_per_unit',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.rate_per_unit.label',
                    placeholder: 'warehouse.item.overview.form.rate_per_unit.placeholder',
                    required: false,
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
                    label: 'warehouse.item.overview.form.remark.label',
                    placeholder: 'warehouse.item.overview.form.remark.placeholder',
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'description',
                type: 'textarea',
                templateOptions: {
                    label: 'warehouse.item.overview.form.description.label',
                    placeholder: 'warehouse.item.overview.form.description.placeholder',
                },
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-formly-form-app-warehouse-item-version',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss'],
})
export class WarehouseItemVersionFormlyComponent
    extends AppFormlyComponent<IWarehouseItem, WarehouseItemDatasource>
    implements AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemOverviewFormlyComponent} class
     * @param dataSource {WarehouseItemDatasource}
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
     * @param categoryDatasource {WarehouseCategoryDatasource}
     */
    constructor(@Inject(WarehouseItemDatasource) dataSource: WarehouseItemDatasource,
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
                @Inject(WarehouseCategoryDatasource) private categoryDatasource?: WarehouseCategoryDatasource,
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource,
                @Inject(WarehouseSettingsDatasource) private settingsDatasource?: WarehouseSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        categoryDatasource || throwError('Could not inject WarehouseCategoryDatasource instance');
        generalSettingsDatasource || throwError('Could not inject GeneralSettingsDatasource instance');
        settingsDatasource || throwError('Could not inject WarehouseSettingsDatasource instance');
        super.config = WarehouseItemVersionFormConfig;
        super.fields = WarehouseItemVersionFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // observe fields
        this.observeFields();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Observe fields
     */
    private observeFields(): void {
        const fields: FormlyFieldConfig[] = this.fields;

        // master settings fields
        this.observeSettingsFields(fields);
    }

    /**
     * Observe master settings fields
     * @param fields to observe
     */
    private observeSettingsFields(fields: FormlyFieldConfig[]): void {
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultSystemGeneralSettingsFormField(
                this.generalSettingsDatasource, fields[5].fieldGroup[1],
                BUILTIN_CODES.CURRENCY.code,
                null, this.noneOption as IGeneralSettings),
        ]).then(value => this.getLogger().debug('Loading settings successful!'),
                reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}

import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
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
import {WarehouseCategoryTreeviewConfig} from '../category/warehouse.category.treeview.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {AppFormlyComponent} from '../../components/app.formly.component';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomValidators} from 'ngx-custom-validators';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/common/validation.utils';

export const WarehouseItemOverviewFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse item overview formly fields config */
export const WarehouseItemOverviewFormFieldsConfig: FormlyFieldConfig[] = [
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
                    'pattern_code': false,
                },
                validators: {
                    'pattern_code': Validators.pattern(ValidationUtils.VALIDATION_CODE_PATTERN),
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
                className: 'col belongTo',
                key: 'categories_id',
                type: 'warehouse-category-treeview',
                templateOptions: {
                    label: 'warehouse.item.overview.form.category.label',
                    placeholder: 'warehouse.item.overview.form.category.placeholder',
                    'config': WarehouseCategoryTreeviewConfig,
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
                key: 'brand_id',
                type: 'ngx-warehouse-settings-brand',
                templateOptions: {
                    label: 'warehouse.item.overview.form.brand.label',
                    placeholder: 'warehouse.item.overview.form.brand.placeholder',
                },
            },
            {
                className: 'col-6',
                key: 'manufacturer',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.manufacturer.label',
                    placeholder: 'warehouse.item.overview.form.manufacturer.placeholder',
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
                type: 'ngx-system-currency',
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
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-3',
                key: 'status',
                type: 'ngx-system-status',
                templateOptions: {
                    label: 'warehouse.item.overview.form.status.label',
                    placeholder: 'warehouse.item.overview.form.status.placeholder',
                },
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-formly-form-app-warehouse-item-overview',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss'],
})
export class WarehouseItemOverviewFormlyComponent
    extends AppFormlyComponent<IWarehouseItem, WarehouseItemDatasource> {

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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.config = WarehouseItemOverviewFormConfig;
        super.fields = WarehouseItemOverviewFormFieldsConfig;
    }
}

import {
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    OnInit,
    Renderer2,
    RendererStyleFlags2,
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
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from '@app/types/index';
import {IWarehouseInventory} from '../../../../../@core/data/warehouse/warehouse.inventory';
import {WarehouseInventoryDatasource,} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';
import {IWarehouse} from '../../../../../@core/data/warehouse/warehouse';
import {WarehouseStorageFormlySelectFieldComponent,} from '../../module.components/warehouse/storage/warehouse.storage.select.field.component';
import {VendorCustomerFormlySelectFieldComponent,} from '../../module.components/common/vendor.customer.select.field.component';
import {ICustomer} from '../../../../../@core/data/system/customer';
import ObjectUtils from '../../../../../utils/common/object.utils';

/* default warehouse in/out main formly config */
export const WarehouseInventoryMainFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse in/out main formly fields config */
export const WarehouseInventoryMainFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
        fieldGroup: [
            // col-1
            {
                className: 'col-6 ml-0 mr-0 pl-0 pr-0 left-col',
                fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                fieldGroup: [
                    // row-1
                    {
                        className: 'w-100 ml-0 mr-0 pl-0 pr-0',
                        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'type',
                                type: 'ngx-warehouse-inventory-type',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.type.label',
                                    placeholder: 'warehouse.inventory.form.type.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'vendor_customer_code',
                                type: 'ngx-vendor-customer',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.customer.label',
                                    placeholder: 'warehouse.inventory.form.customer.placeholder',
                                    required: true,
                                },
                            },
                        ],
                    },
                    // row-2
                    {
                        className: 'w-100 ml-0 mr-0 pl-0 pr-0',
                        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'warehouse_code',
                                type: 'ngx-warehouse-storage',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.storage.label',
                                    placeholder: 'warehouse.inventory.form.storage.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'date',
                                type: 'app-date-picker',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.date.label',
                                    placeholder: 'warehouse.inventory.form.date.placeholder',
                                    'config': {
                                        mode: 'day',
                                        config: {
                                            appendTo: document.body,
                                            format: 'common.date.dd/mm/yyyy',
                                        },
                                    },
                                    required: true,
                                },
                            },
                        ],
                    },
                    // row-3
                    {
                        className: 'w-100 ml-0 mr-0 pl-0 pr-0',
                        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'code',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.code.label',
                                    placeholder: 'warehouse.inventory.form.code.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'reason_for_issuing',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.reason_for_issuing.label',
                                    placeholder: 'warehouse.inventory.form.reason_for_issuing.placeholder',
                                },
                            },
                        ],
                    },
                    // row-4
                    {
                        className: 'w-100 ml-0 mr-0 pl-0 pr-0',
                        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'sales_order',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.sales_order.label',
                                    placeholder: 'warehouse.inventory.form.sales_order.placeholder',
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'deliverer',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.deliverer.label',
                                    placeholder: 'warehouse.inventory.form.deliverer.placeholder',
                                },
                            },
                        ],
                    },

                ],
            },
            // col-2
            {
                className: 'col-3 ml-0 mr-0 mid-col',
                fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                fieldGroup: [
                    {
                        className: 'w-100 remark',
                        key: 'remark',
                        type: 'textarea',
                        templateOptions: {
                            label: 'warehouse.inventory.form.remark.label',
                            placeholder: 'warehouse.inventory.form.remark.placeholder',
                            rows: 5,
                        },
                    },
                    {
                        className: 'w-100 status',
                        key: 'status',
                        type: 'ngx-system-status',
                        templateOptions: {
                            label: 'warehouse.category.form.status.label',
                            placeholder: 'warehouse.category.form.status.placeholder',
                        },
                    },
                ],
            },
            // col-3
            {
                className: 'col-3 ml-0 mr-0 right-col',
                fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                fieldGroup: [
                    {
                        className: 'w-100',
                        key: 'file_attach',
                        type: 'files-gallery',
                        templateOptions: {
                            label: 'warehouse.inventory.form.file_attach.label',
                            placeholder: 'warehouse.inventory.form.file_attach.placeholder',
                        },
                    },
                ],
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-formly-form-app-warehouse-inventory',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
        './warehouse.inventory.main.formly.component.scss',
    ],
})
export class WarehouseInventoryMainFormlyComponent
    extends AppFormlyComponent<IWarehouseInventory, WarehouseInventoryDatasource>
    implements OnInit, AfterContentChecked {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryFormlyComponent} class
     * @param dataSource {DataSource}
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
    constructor(@Inject(WarehouseInventoryDatasource) dataSource: WarehouseInventoryDatasource,
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
        super.config = WarehouseInventoryMainFormConfig;
        super.fields = WarehouseInventoryMainFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // observe fields
        this.__observeFields();
    }

    ngAfterContentChecked(): void {
        super.ngAfterContentChecked();

        // make form beauty
        this.__makeFormBeauty();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Calculate the layout to make it beauty
     * @private
     */
    private __makeFormBeauty(): void {
        // make the remark beauty
        const renderer: Renderer2 = this.getRenderer();
        if (ObjectUtils.isNotNou(renderer) && ObjectUtils.isNotNou(this.getElementRef())) {
            const formElement: Element = this.getElementRef().nativeElement;
            const leftColumn: Element = this.getFirstElementBySelector('.left-col', formElement);
            const midColumn: Element = this.getFirstElementBySelector('.mid-col', formElement);
            const remarkField: Element = this.getFirstElementBySelector('.remark', midColumn);
            const statusField: Element = this.getFirstElementBySelector('.status', midColumn);
            const rightColumn: Element = this.getFirstElementBySelector('.right-col', formElement);
            const leftColOffset: { top: number, left: number,
                width: number, height: number } = this.offset(leftColumn);
            const midColOffset: { top: number, left: number,
                width: number, height: number } = this.offset(midColumn);
            const rightColOffset: { top: number, left: number,
                width: number, height: number } = this.offset(rightColumn);
            const statusOffset: { top: number, left: number,
                width: number, height: number } = this.offset(statusField);
            const maxHeight: number = Math.max(
                Math.max(leftColOffset.height, midColOffset.height), rightColOffset.height);
            (maxHeight > 0)
            && renderer.setStyle(leftColumn, 'height',
                [maxHeight, 'px'].join(''), RendererStyleFlags2.Important);
            (maxHeight > 0)
            && renderer.setStyle(midColumn, 'height',
                [maxHeight, 'px'].join(''), RendererStyleFlags2.Important);
            (maxHeight > 0)
            && renderer.setStyle(rightColumn, 'height',
                [maxHeight, 'px'].join(''), RendererStyleFlags2.Important);
            (maxHeight > 0 && statusOffset.height > 0)
            && renderer.setStyle(remarkField, 'height',
                [(maxHeight - statusOffset.height), 'px'].join(''), RendererStyleFlags2.Important);
        }
    }

    /**
     * Observe model fields for applying values
     */
    private __observeFields(): void {
        const fields: FormlyFieldConfig[] = this.fields;
        fields[0].expressionProperties = {
            'warehouse_code': (model: IWarehouseInventory) => {
                if ((model.warehouse_code || '') !== ((model.warehouse || {})['code'] || '')) {
                    this.__observeWarehouseField(fields, model);
                }
            },
            'vendor_customer_code': (model: IWarehouseInventory) => {
                if ((model.vendor_customer_code || '') !== ((model.vendor_customer || {})['code'] || '')) {
                    this.__observeWarehouseField(fields, model);
                }
            },
        };
    }

    /**
     * Observe {ICustomer} field to apply model
     * @param fields to observe
     * @param model form model
     */
    private __observeWarehouseField(fields: FormlyFieldConfig[], model: IWarehouseInventory): void {
        const customerVendorField: FormlyFieldConfig =
            fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[1];
        const customerVendorFieldComponent: VendorCustomerFormlySelectFieldComponent =
            super.getFormFieldComponent(customerVendorField, VendorCustomerFormlySelectFieldComponent);
        if (customerVendorFieldComponent) {
            const customerVendors: ICustomer[] = customerVendorFieldComponent.selectedValues as ICustomer[];
            model.vendor_customer_id = ((customerVendors || []).length ? customerVendors[0].id : undefined);
            model.vendor_customer = ((customerVendors || []).length ? customerVendors[0] : undefined);
        } else {
            model.vendor_customer_id = undefined;
            model.vendor_customer = undefined;
        }
    }

    /**
     * Observe {ICustomer} field to apply model
     * @param fields to observe
     * @param model form model
     */
    private __observeCustomerField(fields: FormlyFieldConfig[], model: IWarehouseInventory): void {
        const warehouseField: FormlyFieldConfig =
            fields[0].fieldGroup[0].fieldGroup[1].fieldGroup[0];
        const warehouseFieldComponent: WarehouseStorageFormlySelectFieldComponent =
            super.getFormFieldComponent(warehouseField, WarehouseStorageFormlySelectFieldComponent);
        if (warehouseFieldComponent) {
            const warehouses: IWarehouse[] = warehouseFieldComponent.selectedValues as IWarehouse[];
            model.warehouse_id = ((warehouses || []).length ? warehouses[0].id : undefined);
            model.warehouse = ((warehouses || []).length ? warehouses[0] : undefined);
        } else {
            model.warehouse_id = undefined;
            model.warehouse = undefined;
        }
    }
}

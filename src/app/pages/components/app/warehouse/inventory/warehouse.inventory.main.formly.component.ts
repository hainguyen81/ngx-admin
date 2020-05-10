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
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {
    IWarehouseInventory,
} from '../../../../../@core/data/warehouse/warehouse.inventory';
import {
    WarehouseInventoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.inventory/warehouse.inventory.datasource';

/* default warehouse in/out main formly config */
export const WarehouseInventoryMainFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse in/out main formly fields config */
export const WarehouseInventoryMainFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
        fieldGroup: [
            {
                className: 'col-9 ml-0 mr-0 pl-0 pr-0',
                fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                fieldGroup: [
                    {
                        className: 'w-100 ml-0 mr-0 pl-0 pr-0',
                        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                        fieldGroup: [
                            {
                                className: 'col-4',
                                key: 'type',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.type.label',
                                    placeholder: 'warehouse.inventory.form.type.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'vendor_customer',
                                type: 'vendor-customer',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.customer.label',
                                    placeholder: 'warehouse.inventory.form.customer.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'warehouse_id',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.storage.label',
                                    placeholder: 'warehouse.inventory.form.storage.placeholder',
                                    required: true,
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100 ml-0 mr-0 pl-0 pr-0',
                        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                        fieldGroup: [
                            {
                                className: 'col-4',
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
                            {
                                className: 'col-4',
                                key: 'sales_order',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.sales_order.label',
                                    placeholder: 'warehouse.inventory.form.sales_order.placeholder',
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'reason_for_issuing',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.reason_for_issuing.label',
                                    placeholder: 'warehouse.inventory.form.reason_for_issuing.placeholder',
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100 ml-0 mr-0 pl-0 pr-0',
                        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                        fieldGroup: [
                            {
                                className: 'col-4',
                                key: 'code',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.code.label',
                                    placeholder: 'warehouse.inventory.form.code.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'deliverer',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.deliverer.label',
                                    placeholder: 'warehouse.inventory.form.deliverer.placeholder',
                                },
                            },
                            {
                                className: 'col-4',
                                key: 'status',
                                type: 'system-status',
                                templateOptions: {
                                    label: 'warehouse.category.form.status.label',
                                    placeholder: 'warehouse.category.form.status.placeholder',
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100 ml-0 mr-0 pl-0 pr-0',
                        fieldGroupClassName: 'row ml-0 mr-0 pl-0 pr-0',
                        fieldGroup: [
                            {
                                className: 'col-12',
                                key: 'remark',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.inventory.form.remark.label',
                                    placeholder: 'warehouse.inventory.form.remark.placeholder',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                className: 'col-3 ml-0 mr-0',
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
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
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
    implements AfterViewInit {

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

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }
}

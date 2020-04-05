/* default organization formly config */
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseFormlyComponent} from '../../../formly/base.formly.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {WarehouseCategoryDatasource} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {IWarehouseCategory} from '../../../../../@core/data/warehouse/warehouse.category';
import {Observable} from 'rxjs';
import PromiseUtils from '../../../../../utils/promise.utils';
import {isArray} from 'util';

export const WarehouseItemOverviewFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse item overview formly fields config */
export const WarehouseItemOverviewFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'categories_id',
                type: 'select',
                templateOptions: {
                    label: 'warehouse.item.overview.form.category.label',
                    placeholder: 'warehouse.item.overview.form.category.placeholder',
                    options: [],
                    disabled: false,
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
                key: 'brand_id',
                type: 'select',
                templateOptions: {
                    label: 'warehouse.item.overview.form.brand.label',
                    placeholder: 'warehouse.item.overview.form.brand.placeholder',
                    options: [],
                    disabled: false,
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
                    label: 'warehouse.item.overview.form.code.label',
                    placeholder: 'warehouse.item.overview.form.code.placeholder',
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
                    required: false,
                },
            },
            {
                className: 'col-6',
                key: 'number_of_prints',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.number_of_prints.label',
                    placeholder: 'warehouse.item.overview.form.number_of_prints.placeholder',
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
                key: 'serial',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.serial.label',
                    placeholder: 'warehouse.item.overview.form.serial.placeholder',
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
                className: 'col-3',
                key: 'length',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.length.label',
                    placeholder: 'warehouse.item.overview.form.length.placeholder',
                    required: false,
                },
            },
            {
                className: 'col-3',
                key: 'width',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.width.label',
                    placeholder: 'warehouse.item.overview.form.width.placeholder',
                    required: false,
                },
            },
            {
                className: 'col-3',
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
                className: 'col-6',
                key: 'dealer_price',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.dealer_price.label',
                    placeholder: 'warehouse.item.overview.form.dealer_price.placeholder',
                    required: true,
                },
            },
            {
                className: 'col-6',
                key: 'cost_price',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.cost_price.label',
                    placeholder: 'warehouse.item.overview.form.cost_price.placeholder',
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
                key: 'selling_price',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.item.overview.form.selling_price.label',
                    placeholder: 'warehouse.item.overview.form.selling_price.placeholder',
                    required: true,
                },
            },
            {
                className: 'col-6',
                key: 'currency',
                type: 'input',
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
    selector: 'ngx-formly-form-warehouse-item-overview',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss'],
})
export class WarehouseItemOverviewFormlyComponent
    extends BaseFormlyComponent<IWarehouseItem, WarehouseItemDatasource>
    implements AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Set the form fields configuration
     * @param fields to apply
     */
    protected setFields(fields: FormlyFieldConfig[]) {
        let timer: number;
        timer = window.setTimeout(() => {
            this.loadWarehouseCategories().subscribe(categories => {
                fields[0].fieldGroup[0].templateOptions.options = categories;
                super.setFields(fields);
                window.clearTimeout(timer);
            });
        }, 100);
    }

    /**
     * Get the {WarehouseCategoryDatasource} instance
     * @return the {WarehouseCategoryDatasource} instance
     */
    protected getCategoryDatasource(): WarehouseCategoryDatasource {
        return this.categoryDatasource;
    }

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
                @Inject(WarehouseCategoryDatasource) private categoryDatasource?: WarehouseCategoryDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            WarehouseItemOverviewFormConfig, WarehouseItemOverviewFormFieldsConfig);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // let timer: number;
        // timer = window.setTimeout(() => {
        //     this.loadWarehouseCategories().subscribe(categories => {
        //         this.getLogger().debug('Loading Warehouse Categories...', categories);
        //         this.getFields()[0].fieldGroup[0].templateOptions.options = categories;
        //         window.clearTimeout(timer);
        //     });
        // }, 300);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Load all warehouse categories for selection
     */
    protected loadWarehouseCategories(): Observable<{ value: string, label: string }[]> {
        if (!this.categoryDatasource) {
            return new Observable<{ value: string, label: string }[]>();
        }

        return PromiseUtils.promiseToObservable(
            this.categoryDatasource.setPaging(1, undefined, false)
                .setFilter([], false, false)
                .getAll().then(values => {
                    let categories: IWarehouseCategory[];
                    if (!isArray(values)) {
                        categories = [ values as IWarehouseCategory ];

                    } else  {
                        categories = values as IWarehouseCategory[];
                    }
                    let options: { value: string, label: string }[];
                    options = [];
                    Array.from(categories).forEach((value: IWarehouseCategory) => {
                        this.mapCategoryAsOptions(value, options);
                    });
                    return options;
                }));
    }

    /**
     * Map the specified {IWarehouseCategory} into the return options array recursively
     * @param value to map
     * @param retValues to push returned values
     */
    private mapCategoryAsOptions(value: IWarehouseCategory, retValues: { value: string, label: string }[]): void {
        if (!value || !Object.keys(value).length) {
            return;
        }

        if (!retValues) {
            retValues = [];
        }
        let category: string;
        category = [value.name, ['(', value.code, ')'].join('')].join(' ').trim();
        retValues.push({value: value.id, label: category});
        if (value && value.children.length) {
            value.children.forEach(child => this.mapCategoryAsOptions(child, retValues));
        }
    }
}

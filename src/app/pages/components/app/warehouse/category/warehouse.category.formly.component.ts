import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseFormlyComponent} from '../../../formly/base.formly.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import PromiseUtils from '../../../../../utils/promise.utils';
import {isArray} from 'util';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import WarehouseCategory, {
    CATEGORY_TYPE,
    convertWarehouseCategoryTypeToDisplay,
    IWarehouseCategory,
} from '../../../../../@core/data/warehouse/warehouse.category';
import {
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';

/* default warehouse category formly config */
export const WarehouseCategoryFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse category formly fields config */
export const WarehouseCategoryFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col',
                key: 'parentId',
                type: 'select',
                templateOptions: {
                    label: 'warehouse.category.form.belongTo.label',
                    placeholder: 'warehouse.category.form.belongTo.placeholder',
                    options: [],
                    disabled: true,
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
                key: 'type',
                type: 'select',
                templateOptions: {
                    label: 'warehouse.category.form.type.label',
                    placeholder: 'warehouse.category.form.type.placeholder',
                    options: [
                        {
                            value: CATEGORY_TYPE.TYPE,
                            label: convertWarehouseCategoryTypeToDisplay(CATEGORY_TYPE.TYPE),
                        },
                        {
                            value: CATEGORY_TYPE.BRAND,
                            label: convertWarehouseCategoryTypeToDisplay(CATEGORY_TYPE.BRAND),
                        },
                        {
                            value: CATEGORY_TYPE.CATEGORY,
                            label: convertWarehouseCategoryTypeToDisplay(CATEGORY_TYPE.CATEGORY),
                        },
                    ],
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
                key: 'code',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.category.form.code.label',
                    placeholder: 'warehouse.category.form.code.placeholder',
                    required: true,
                },
            },
            {
                className: 'col-6',
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.category.form.name.label',
                    placeholder: 'warehouse.category.form.name.placeholder',
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
                key: 'image',
                type: 'images-gallery',
                templateOptions: {
                    label: 'warehouse.category.form.image.label',
                    placeholder: 'warehouse.category.form.image.placeholder',
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
                    label: 'warehouse.category.form.remark.label',
                    placeholder: 'warehouse.category.form.remark.placeholder',
                },
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form-warehouse-category',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss', './warehouse.category.formly.component.scss'],
})
export class WarehouseCategoryFormlyComponent
    extends BaseFormlyComponent<IWarehouseCategory, WarehouseCategoryDatasource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseCategoryFormlyComponent} class
     * @param dataSource {WarehouseCategoryDatasource}
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
    constructor(@Inject(WarehouseCategoryDatasource) dataSource: WarehouseCategoryDatasource,
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
            modalDialogService, confirmPopup, lightbox,
            WarehouseCategoryFormConfig, WarehouseCategoryFormFieldsConfig);
        // parent selection settings
        super.getFields()[0].fieldGroup[0].templateOptions.options = this.getAllWarehouseCategories();
        super.setModel(new WarehouseCategory(undefined, undefined, undefined, CATEGORY_TYPE.CATEGORY));
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Get the warehouse categories list for options selection
     * @return {Observable}
     */
    private getAllWarehouseCategories(): Observable<{ value: string, label: string }[]> {
        return PromiseUtils.promiseToObservable(
            this.getDataSource().getAll().then(values => {
                if (!isArray(values)) {
                    values = [].push(values);
                }
                let options: { value: string, label: string }[];
                options = [];
                Array.from(values).forEach((value: IWarehouseCategory) => {
                    this.mapWarehouseCategoryAsOptions(value, options);
                });
                return options;
            }));
    }

    /**
     * Map the specified {IWarehouseCategory} into the return options array recursively
     * @param value to map
     * @param retValues to push returned values
     */
    private mapWarehouseCategoryAsOptions(
        value: IWarehouseCategory, retValues: { value: string, label: string }[]): void {
        if (!value || !((value || {})['id'] || '').length) {
            return;
        }

        if (!retValues) {
            retValues = [];
        }
        retValues.push({value: value.id, label: value.name});
        if (value.children && value.children.length) {
            for (const child of value.children) {
                this.mapWarehouseCategoryAsOptions(child, retValues);
            }
        }
    }
}

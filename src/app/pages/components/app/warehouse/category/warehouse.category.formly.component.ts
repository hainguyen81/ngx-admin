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
import {
    CATEGORY_TYPE,
    convertWarehouseCategoryTypeToDisplay,
    IWarehouseCategory,
} from '../../../../../@core/data/warehouse/warehouse.category';
import {
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {
    WarehouseCategoryFormlyTreeviewDropdownFieldComponent,
} from './warehouse.category.formly.treeview.dropdown.field.component';
import WarehouseDataUtils from '../../../../../utils/warehouse/warehouse.data.utils';
import {WarehouseCategoryTreeviewConfig} from './warehouse.category.treeview.component';
import {AppFormlyComponent} from '../../components/app.formly.component';
import {API} from '../../../../../config/api.config';

/* default warehouse category formly config */
export const WarehouseCategoryFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse category formly fields config */
export const WarehouseCategoryFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-8 category-info',
                fieldGroupClassName: 'row ml-0 mr-0',
                fieldGroup: [
                    {
                        className: 'w-100 belongTo',
                        key: 'parentId',
                        type: 'warehouse-category-treeview-dropdown',
                        templateOptions: {
                            label: 'warehouse.category.form.belongTo.label',
                            placeholder: 'warehouse.category.form.belongTo.placeholder',
                            options: [],
                        },
                    },
                    {
                        className: 'w-75',
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
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0',
                        fieldGroup: [
                            {
                                className: 'w-50 pl-0 pr-2',
                                key: 'code',
                                type: 'input',
                                templateOptions: {
                                    label: 'warehouse.category.form.code.label',
                                    placeholder: 'warehouse.category.form.code.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'w-50 pl-2 pr-0',
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
                        className: 'w-100',
                        key: 'remark',
                        type: 'textarea',
                        templateOptions: {
                            label: 'warehouse.category.form.remark.label',
                            placeholder: 'warehouse.category.form.remark.placeholder',
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
    moduleId: API.warehouseCategory.code,
    selector: 'ngx-formly-form-app-warehouse-category',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
        './warehouse.category.formly.component.scss',
    ],
})
export class WarehouseCategoryFormlyComponent
    extends AppFormlyComponent<IWarehouseCategory, WarehouseCategoryDatasource> {

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
            modalDialogService, confirmPopup, lightbox);
        super.setConfig(WarehouseCategoryFormConfig);
        super.setFields(WarehouseCategoryFormFieldsConfig);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise when the model of form had been changed
     */
    protected onModelChanged() {
        super.onModelChanged();

        // refresh belongTo field
        WarehouseDataUtils.invokeAllWarehouseCategories(<WarehouseCategoryDatasource>this.getDataSource())
            .then(categories => {
                let options: any[];
                options = [];
                options.push(WarehouseCategoryTreeviewConfig);
                options.push(categories);
                let belongToComponent: WarehouseCategoryFormlyTreeviewDropdownFieldComponent;
                belongToComponent = this.getFormFieldComponent(
                    this.getFormlyForm().fields[0].fieldGroup[0].fieldGroup[0],
                    WarehouseCategoryFormlyTreeviewDropdownFieldComponent);
                if (belongToComponent) {
                    belongToComponent.reloadFieldByOptions(options);
                    this.disableModelFromBelongTo(
                        this.getFormlyForm().fields[0].fieldGroup[0].fieldGroup[0],
                        this.getFormlyForm().model);
                }
            });
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Disable current data model in the belongTo field
     * @param field to parse field component
     * @param model to disable
     */
    private disableModelFromBelongTo(field: FormlyFieldConfig, model?: IWarehouseCategory | null) {
        model = model || this.getModel();
        if (!model || !(model.id || '').length) {
            return;
        }

        // detect field component
        let belongToComponent: WarehouseCategoryFormlyTreeviewDropdownFieldComponent;
        belongToComponent = this.getFormFieldComponent(field, WarehouseCategoryFormlyTreeviewDropdownFieldComponent);

        // disable current model item in treeview
        belongToComponent && belongToComponent.disableItemsByValue(model);

        // select current model item in treeview
        belongToComponent && belongToComponent.setSelectedValue(model.parentId);
    }
}

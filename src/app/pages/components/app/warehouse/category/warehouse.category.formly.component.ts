import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseFormlyComponent} from '../../../formly/base.formly.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {ToastrService} from 'ngx-toastr';
import {Observable, of} from 'rxjs';
import PromiseUtils from '../../../../../utils/promise.utils';
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
} from './warehouse.category.formly.treeview.dropdown.field';
import {IEvent} from '../../../abstract.component';
import WarehouseUtils from '../../../../../utils/warehouse/warehouse.utils';

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
    selector: 'ngx-formly-form-warehouse-category',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss', './warehouse.category.formly.component.scss'],
})
export class WarehouseCategoryFormlyComponent
    extends BaseFormlyComponent<IWarehouseCategory, WarehouseCategoryDatasource>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Set the form fields configuration
     * @param fields to apply
     */
    protected setFields(fields: FormlyFieldConfig[]) {
        // initialize fields configuration
        this.initializeFields(fields);

        // apply fields configuration
        super.setFields(fields);
    }

    /**
     * Get the {WarehouseCategoryFormlyTreeviewDropdownFieldComponent} of the specified `belongTo` field
     * @param field to parse component
     * @return the {WarehouseCategoryFormlyTreeviewDropdownFieldComponent}
     */
    protected getBelongToFieldComponent(field: FormlyFieldConfig):
        WarehouseCategoryFormlyTreeviewDropdownFieldComponent {
        let belongToComponent: WarehouseCategoryFormlyTreeviewDropdownFieldComponent;
        belongToComponent = (field && field.templateOptions && field.templateOptions['componentRef']
            ? <WarehouseCategoryFormlyTreeviewDropdownFieldComponent>
                field.templateOptions['componentRef'] : null);
        return belongToComponent;
    }

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
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();
        this.ngModelChanged.subscribe(
            (e: IEvent) => {
                this.disableModelFromBelongTo(
                    this.getFormlyForm().fields[0].fieldGroup[0].fieldGroup[0], e.$data);
            });
    }

    onDataSourceChanged(value: IEvent) {
        super.onDataSourceChanged(value);
        this.invokeLoadWarehouseCategories().then(options => {
            let belongToComponent: WarehouseCategoryFormlyTreeviewDropdownFieldComponent;
            belongToComponent = this.getBelongToFieldComponent(
                this.getFormlyForm().fields[0].fieldGroup[0].fieldGroup[0]);
            belongToComponent && belongToComponent.reloadFieldByOptions(options);
        });
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Initialize the specified fields configuration
     * @param fields to initialize
     */
    private initializeFields(fields: FormlyFieldConfig[]) {
        fields[0].fieldGroup[0].fieldGroup[0].templateOptions.options = this.observeWarehouseCategories();
        fields[0].fieldGroup[0].fieldGroup[0].hooks = {
            afterViewInit: field => {
                let belongToComponent: WarehouseCategoryFormlyTreeviewDropdownFieldComponent;
                belongToComponent = this.getBelongToFieldComponent(field);
                belongToComponent && belongToComponent.ngAfterLoadData.subscribe(e => {
                    this.disableModelFromBelongTo(field);
                });
            },
        };
    }

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
        belongToComponent = this.getBelongToFieldComponent(field);

        // disable current model item in treeview
        belongToComponent && belongToComponent.disableItemsByValue(model);

        // select current model item in treeview
        belongToComponent && belongToComponent.setSelectedValue(model.parentId);
    }

    /**
     * Get the warehouse categories list for options selection
     * @return {Observable}
     */
    private observeWarehouseCategories(): Observable<any[]> {
        return PromiseUtils.promiseToObservable(this.invokeLoadWarehouseCategories());
    }
    private invokeLoadWarehouseCategories(): Promise<any[]> {
        return this.getDataSource().getAll().then(values => {
            return [WarehouseCategoryFormConfig,
                WarehouseUtils.buildWarehouseCategories(values as IWarehouseCategory[])];
        });
    }
}

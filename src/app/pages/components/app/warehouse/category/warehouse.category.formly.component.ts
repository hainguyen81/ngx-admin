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
import {
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {
    WarehouseCategoryFormlyTreeviewDropdownFieldComponent,
} from './warehouse.category.formly.treeview.dropdown.field.component';
import WarehouseDataUtils from '../../../../../utils/warehouse/warehouse.data.utils';
import {WarehouseCategoryTreeviewConfig} from './warehouse.category.treeview.component';
import {AppFormlyComponent} from '../../components/app.formly.component';
import {IWarehouseCategory} from '../../../../../@core/data/warehouse/warehouse.category';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import PromiseUtils from '../../../../../utils/promise.utils';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import {ActivatedRoute, Router} from '@angular/router';
import {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/validation.utils';
import {isNullOrUndefined} from 'util';

/* default warehouse category formly config */
export const WarehouseCategoryFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse category formly fields config */
export const WarehouseCategoryFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-8 ml-0 mr-0 p-0 category-info',
                fieldGroupClassName: 'row ml-0 mr-0 p-0',
                fieldGroup: [
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col',
                                key: 'parentId',
                                type: 'warehouse-category-treeview-dropdown',
                                templateOptions: {
                                    label: 'warehouse.category.form.belongTo.label',
                                    placeholder: 'warehouse.category.form.belongTo.placeholder',
                                    'config': WarehouseCategoryTreeviewConfig,
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
                        fieldGroup: [
                            {
                                className: 'col-6',
                                key: 'type',
                                type: 'select-ex-general-settings',
                                templateOptions: {
                                    label: 'warehouse.category.form.type.label',
                                    placeholder: 'warehouse.category.form.type.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'status',
                                type: 'select-ex-general-settings',
                                templateOptions: {
                                    label: 'warehouse.category.form.status.label',
                                    placeholder: 'warehouse.category.form.status.placeholder',
                                    required: true,
                                },
                            },
                        ],
                    },
                    {
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
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
                                validators: {
                                    validation: [Validators.pattern(ValidationUtils.VALIDATION_CODE_PATTERN)],
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
                        className: 'w-100',
                        fieldGroupClassName: 'row ml-0 mr-0 p-0',
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
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_CATEGORY,
    selector: 'ngx-formly-form-app-warehouse-category',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
        './warehouse.category.formly.component.scss',
    ],
})
export class WarehouseCategoryFormlyComponent
    extends AppFormlyComponent<IWarehouseCategory, WarehouseCategoryDatasource>
    implements OnInit {

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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
        super.config = WarehouseCategoryFormConfig;
        super.fields = WarehouseCategoryFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // observe belongTo fields
        const fields: FormlyFieldConfig[] = this.fields;
        PromiseUtils.parallelPromises(undefined, undefined, [
            this.observeBelongToField(fields[0].fieldGroup[0].fieldGroup[0].fieldGroup[0]),
            AppObserveUtils.observeDefaultSystemGeneralSettingsFormField(
                this.generalSettingsDatasource, fields[0].fieldGroup[0].fieldGroup[1].fieldGroup[0],
                BUILTIN_CODES.WAREHOUSE_CATEGORY_TYPE.code,
                null, this.noneOption as IGeneralSettings),
            AppObserveUtils.observeDefaultSystemGeneralSettingsFormField(
                this.generalSettingsDatasource, fields[0].fieldGroup[0].fieldGroup[1].fieldGroup[1],
                BUILTIN_CODES.STATUS.code,
                null, this.noneOption as IGeneralSettings),
        ]).then(value => this.getLogger().debug('Loading parent organization/manager data successful'),
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Observe belongTo field
     * @param field to apply
     */
    private observeBelongToField(field: FormlyFieldConfig): Promise<void> {
        return WarehouseDataUtils.invokeAllWarehouseCategories(
            <WarehouseCategoryDatasource>this.getDataSource()).then(
                categories => {
                    let belongToComponent: WarehouseCategoryFormlyTreeviewDropdownFieldComponent;
                    belongToComponent = this.getFormFieldComponent(
                        field, WarehouseCategoryFormlyTreeviewDropdownFieldComponent);
                    if (!isNullOrUndefined(belongToComponent)) {
                        belongToComponent.items = categories;
                        this.disableModelFromBelongTo(field, this.getModel());
                    }
                });
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
        belongToComponent = this.getFormFieldComponent(field, WarehouseCategoryFormlyTreeviewDropdownFieldComponent);

        // disable current model item in treeview
        belongToComponent && belongToComponent.disableItemsByValue(model);

        // select current model item in treeview
        belongToComponent && belongToComponent.setSelectedValue(model.parentId);
    }
}

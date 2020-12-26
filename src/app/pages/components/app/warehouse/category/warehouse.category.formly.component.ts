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
    WarehouseCategoryDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.category/warehouse.category.datasource';
import {WarehouseCategoryTreeviewConfig} from './warehouse.category.treeview.component';
import {AppFormlyComponent} from '../../components/app.formly.component';
import {IWarehouseCategory} from '../../../../../@core/data/warehouse/warehouse.category';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {ActivatedRoute, Router} from '@angular/router';
import {Validators} from '@angular/forms';
import ValidationUtils from '../../../../../utils/common/validation.utils';

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
                                type: 'warehouse-category-treeview',
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
                                type: 'ngx-warehouse-category-type',
                                templateOptions: {
                                    label: 'warehouse.category.form.type.label',
                                    placeholder: 'warehouse.category.form.type.placeholder',
                                    required: true,
                                },
                            },
                            {
                                className: 'col-6',
                                key: 'status',
                                type: 'ngx-system-status',
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
                                    'pattern_code': false,
                                },
                                validators: {
                                    'pattern_code': Validators.pattern(ValidationUtils.VALIDATION_CODE_PATTERN),
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
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS_CATEGORY,
    selector: 'ngx-formly-form-app-warehouse-category',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.config = WarehouseCategoryFormConfig;
        super.fields = WarehouseCategoryFormFieldsConfig;
    }
}

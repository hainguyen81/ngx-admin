import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseFormlyComponent} from '../../../formly/base.formly.component';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {
    CATEGORIES_TYPE,
    convertCategoriesTypeToDisplay,
    ICategories,
} from '../../../../../@core/data/warehouse_catelogies';
import {CategoriesDataSource} from '../../../../../services/implementation/categories/categories.datasource';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';

/* default categories formly config */
export const CategoriesFormConfig: FormlyConfig = new FormlyConfig();

/* default categories formly fields config */
export const CategoriesFormFieldsConfig: FormlyFieldConfig[] = [
    {
        key: 'parentId',
        type: 'select',
        templateOptions: {
            label: 'system.categories.form.category.label',
            placeholder: 'system.categories.form.category.placeholder',
            options: [
                { value: 1, label: 'Parent 1'  },
                { value: 2, label: 'Parent 2'  },
                { value: 3, label: 'Parent 3'  },
                { value: 4, label: 'Parent 4'  },
            ],
        },
    },
    {
        key: 'type',
        type: 'select',
        templateOptions: {
            label: 'system.categories.form.type.label',
            placeholder: 'system.categories.form.type.placeholder',
            options: [
                {
                    value: CATEGORIES_TYPE.UPPER_CATEGORIES,
                    label: convertCategoriesTypeToDisplay(CATEGORIES_TYPE.UPPER_CATEGORIES),
                },
                {
                    value: CATEGORIES_TYPE.TYPE,
                    label: convertCategoriesTypeToDisplay(CATEGORIES_TYPE.UPPER_CATEGORIES),
                },
                {
                    value: CATEGORIES_TYPE.BRAND,
                    label: convertCategoriesTypeToDisplay(CATEGORIES_TYPE.UPPER_CATEGORIES),
                },
            ],
        },
    },
    {
        key: 'id',
        type: 'input',
        templateOptions: {
            label: 'system.categories.form.id.label',
            placeholder: 'system.categories.form.id.placeholder',
        },
    },
    {
        key: 'name',
        type: 'input',
        templateOptions: {
            label: 'system.categories.form.name.label',
            placeholder: 'system.categories.form.name.placeholder',
        },
    },
    {
        key: 'image',
        type: 'input',
        templateOptions: {
            label: 'system.categories.form.image.label',
            placeholder: 'system.categories.form.image.placeholder',
        },
    },
    {
        key: 'remark',
        type: 'textarea',
        templateOptions: {
            label: 'system.categories.form.remark.label',
            placeholder: 'system.categories.form.remark.placeholder',
        },
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: ['../../../formly/formly.component.scss'],
})
export class CategoriesFormlyComponent extends BaseFormlyComponent<ICategories, CategoriesDataSource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CategoriesFormlyComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toastrService
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param modalDialogService
     * @param confirmPopup
     */
    constructor(@Inject(DataSource) dataSource: CategoriesDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toastrService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toastrService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
            modalDialogService, confirmPopup,
            CategoriesFormConfig, CategoriesFormFieldsConfig);
        // parent selection settings
        // super.getFields()[0].fieldGroup[0].templateOptions.options = this.getAllOrganization();
        // // manager selection settings
        // super.getFields()[1].fieldGroup[1].templateOptions.options = this.getAllUsers();
        // super.setModel(new Organization(undefined, undefined, undefined, undefined));
    }
}

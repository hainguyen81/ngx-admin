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
import {ToasterService} from 'angular2-toaster';
import {COMMON} from '../../../../../config/common.config';
import {IFormActionsConfig} from '../../../formly/abstract.formly.component';
import Categories, { ICategories } from '../../../../../@core/data/warehouse_catelogies';
import { CategoriesDataSource } from '../../../../../services/implementation/categories/categories.datasource';

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
                    value: 'ORGANIZTAION_TYPE.HEAD_CENTER',
                    label: 'convertcategoriesTypeToDisplay(ORGANIZTAION_TYPE.HEAD_CENTER)',
                },
                {
                    value: 'ORGANIZTAION_TYPE.BRANCH',
                    label: 'convertcategoriesTypeToDisplay(ORGANIZTAION_TYPE.BRANCH)',
                },
                {
                    value: 'ORGANIZTAION_TYPE.DIVISION',
                    label: 'convertcategoriesTypeToDisplay(ORGANIZTAION_TYPE.DIVISION)',
                },
                {
                    value: 'ORGANIZTAION_TYPE.UNIT',
                    label: 'convertcategoriesTypeToDisplay(ORGANIZTAION_TYPE.UNIT)',
                },
                {
                    value: 'ORGANIZTAION_TYPE.DEPARTMENT',
                    label: 'convertcategoriesTypeToDisplay(ORGANIZTAION_TYPE.DEPARTMENT)',
                },
                {
                    value: 'ORGANIZTAION_TYPE.TEAM_GROUP',
                    label: 'convertcategoriesTypeToDisplay(ORGANIZTAION_TYPE.TEAM_GROUP)',
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

/* formly actions */
export const CategoriesFormlyActions: IFormActionsConfig[] = [].concat(COMMON.baseFormActions);

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
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     */
    constructor(@Inject(DataSource) dataSource: CategoriesDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToasterService) toasterService: ToasterService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
            CategoriesFormConfig, CategoriesFormFieldsConfig, null, CategoriesFormlyActions);
        super.setModel(new Categories(undefined, undefined, undefined, undefined));
    }
}

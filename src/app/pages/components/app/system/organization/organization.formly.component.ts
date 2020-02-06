import {Component, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {BaseFormlyComponent} from '../../../formly/base.formly.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import Organization, {convertOrganizationTypeToDisplay, IOrganization, ORGANIZTAION_TYPE} from '../../../../../@core/data/organization';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';

/* default organization formly config */
export const OrganizationFormConfig: FormlyConfig = new FormlyConfig();

/* default organization formly fields config */
export const OrganizationFormFieldsConfig: FormlyFieldConfig[] = [
    {
        key: 'parentId',
        type: 'select',
        templateOptions: {
            label: 'system.organization.form.belongTo.label',
            placeholder: 'system.organization.form.belongTo.placeholder',
            description: 'system.organization.form.belongTo.description',
            options: [
                { value: 1, label: 'Parent 1'  },
                { value: 2, label: 'Parent 2'  },
                { value: 3, label: 'Parent 3'  },
                { value: 4, label: 'Parent 4'  },
            ],
        },
    },
    {
        key: 'managerId',
        type: 'select',
        templateOptions: {
            label: 'system.organization.form.manager.label',
            placeholder: 'system.organization.form.manager.placeholder',
            description: 'system.organization.form.manager.description',
            options: [
                { value: 1, label: 'Manager 1'  },
                { value: 2, label: 'Manager 2'  },
                { value: 3, label: 'Manager 3'  },
                { value: 4, label: 'Manager 4'  },
            ],
        },
    },
    {
        key: 'code',
        type: 'input',
        templateOptions: {
            label: 'system.organization.form.code.label',
            placeholder: 'system.organization.form.code.placeholder',
            description: 'system.organization.form.code.description',
        },
    },
    {
        key: 'name',
        type: 'input',
        templateOptions: {
            label: 'system.organization.form.name.label',
            placeholder: 'system.organization.form.name.placeholder',
            description: 'system.organization.form.name.description',
        },
    },
    {
        key: 'type',
        type: 'select',
        templateOptions: {
            label: 'system.organization.form.type.label',
            placeholder: 'system.organization.form.type.placeholder',
            description: 'system.organization.form.type.description',
            options: [
                {
                    value: ORGANIZTAION_TYPE.HEAD_CENTER,
                    label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.HEAD_CENTER),
                },
                {
                    value: ORGANIZTAION_TYPE.BRANCH,
                    label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.BRANCH),
                },
                {
                    value: ORGANIZTAION_TYPE.DIVISION,
                    label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.DIVISION),
                },
                {
                    value: ORGANIZTAION_TYPE.UNIT,
                    label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.UNIT),
                },
                {
                    value: ORGANIZTAION_TYPE.DEPARTMENT,
                    label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.DEPARTMENT),
                },
                {
                    value: ORGANIZTAION_TYPE.TEAM_GROUP,
                    label: convertOrganizationTypeToDisplay(ORGANIZTAION_TYPE.TEAM_GROUP),
                },
            ],
        },
    },
    {
        key: 'tax',
        type: 'input',
        templateOptions: {
            label: 'system.organization.form.tax.label',
            placeholder: 'system.organization.form.tax.placeholder',
            description: 'system.organization.form.tax.description',
        },
    },
    {
        key: 'address',
        type: 'input',
        templateOptions: {
            label: 'system.organization.form.address.label',
            placeholder: 'system.organization.form.address.placeholder',
            description: 'system.organization.form.address.description',
        },
    },
    {
        key: 'tel',
        type: 'input',
        templateOptions: {
            label: 'system.organization.form.tel.label',
            placeholder: 'system.organization.form.tel.placeholder',
            description: 'system.organization.form.tel.description',
        },
    },
    {
        key: 'fax',
        type: 'input',
        templateOptions: {
            label: 'system.organization.form.fax.label',
            placeholder: 'system.organization.form.fax.placeholder',
            description: 'system.organization.form.fax.description',
        },
    },
    {
        key: 'email',
        type: 'input',
        templateOptions: {
            label: 'system.organization.form.email.label',
            placeholder: 'system.organization.form.email.placeholder',
            description: 'system.organization.form.email.description',
        },
    },
    {
        key: 'contact',
        type: 'input',
        templateOptions: {
            label: 'system.organization.form.contact.label',
            placeholder: 'system.organization.form.contact.placeholder',
            description: 'system.organization.form.contact.description',
        },
    },
    {
        key: 'remark',
        type: 'textarea',
        templateOptions: {
            label: 'system.organization.form.remark.label',
            placeholder: 'system.organization.form.remark.placeholder',
            description: 'system.organization.form.remark.description',
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
export class OrganizationFormlyComponent extends BaseFormlyComponent<IOrganization, OrganizationDataSource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     */
    constructor(@Inject(DataSource) dataSource: OrganizationDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver,
            OrganizationFormConfig, OrganizationFormFieldsConfig);
        super.setModel(new Organization('', '', '', ORGANIZTAION_TYPE.HEAD_CENTER));
    }
}
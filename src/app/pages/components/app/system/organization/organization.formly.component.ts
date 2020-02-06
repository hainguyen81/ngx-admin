import {Component, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {BaseFormlyComponent} from '../../../formly/base.formly.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {IOrganization} from '../../../../../@core/data/organization';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';

/* default organization formly config */
export const OrganizationFormConfig: FormlyConfig = new FormlyConfig();

/* default organization formly fields config */
export const OrganizationFormFieldsConfig: FormlyFieldConfig[] = [
    {
        key: 'code',
        type: 'input',
        templateOptions: {
            label: '',
        },
    },
];

// : string;
// name: string;
// parentId?: string | null;
// parent?: IOrganization | null;
// type: ORGANIZTAION_TYPE;
// tax?: string | null;
// address?: string | null;
// tel?: string | null;
// fax?: string | null;
// email?: string | null;
// remark?: string | null;
// managerId?: string | null;
// manager?: any;
// contact?: string | null;
// image?: string | { icon: string, pack: string } | null;
// children?: IOrganization[] | null;

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
    }
}

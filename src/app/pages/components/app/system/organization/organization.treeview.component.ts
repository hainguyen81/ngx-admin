import {Component, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {BaseNgxTreeviewComponent} from '../../../treeview/base.treeview.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeviewItem} from 'ngx-treeview';
import {isArray} from 'util';
import {IOrganization} from '../../../../../@core/data/organization';

export const OrganizationTreeviewConfig: TreeviewConfig = {
    decoupleChildFromParent: false,
    hasAllCheckBox: false,
    hasCollapseExpand: true,
    hasDivider: true,
    hasFilter: true,
    maxHeight: -1,
};

/**
 * Base tree-view component base on {TreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: '../../../treeview/treeview.component.html',
    styleUrls: ['../../../treeview/treeview.component.scss'],
})
export class OrganizationTreeviewComponent extends BaseNgxTreeviewComponent<OrganizationDataSource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseNgxTreeviewComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     */
    constructor(@Inject(OrganizationDataSource) dataSource: OrganizationDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver) {
        super(dataSource, contextMenuService, logger, renderer,
            translateService, factoryResolver, OrganizationTreeviewConfig);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Mapping organization data to organization tree item
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        let items: TreeviewItem[];
        items = super.mappingDataSourceToTreeviewItems(data);
        let arrData: any[];
        if (!isArray(data)) {
            arrData.push(data);
        } else {
            arrData = arrData.concat(data as []);
        }
        for (const dat of arrData) {
            let organization: IOrganization;
            organization = dat as IOrganization;
            if (organization) {
                let item: TreeviewItem;
                item = new TreeviewItem({
                    checked: false,
                    children: [],
                    collapsed: false,
                    disabled: false,
                    text: organization.name,
                    value: organization,
                }, true);
                items.push(item);
            }
        }
        return items;
    }
}

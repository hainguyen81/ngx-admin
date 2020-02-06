import {Component, ComponentFactoryResolver, Inject, OnInit, Renderer2} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {BaseNgxTreeviewComponent} from '../../../treeview/base.treeview.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeviewItem} from 'ngx-treeview';
import {IOrganization} from '../../../../../@core/data/organization';
import OrganizationUtils from '../../../../../utils/organization.utils';

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
export class OrganizationTreeviewComponent extends BaseNgxTreeviewComponent<OrganizationDataSource>
    implements OnInit {

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
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver);
        super.setConfig(OrganizationTreeviewConfig);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();
        super.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Mapping organization data to organization tree item
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        return OrganizationUtils.buildOrganization(data as IOrganization[]);
    }
}

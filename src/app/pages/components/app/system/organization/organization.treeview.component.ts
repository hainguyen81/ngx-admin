import {Component, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {NgxTreeviewComponent} from '../../../treeview/treeview.component';
import {BaseNgxTreeviewComponent} from '../../../treeview/base.treeview.component';
import {OrganizationDataSource} from '../../../../../services/implementation/organization/organization.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';

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
     * @param treeviewConfig {TreeviewConfig}
     */
    constructor(@Inject(OrganizationDataSource) dataSource: OrganizationDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                treeviewConfig?: TreeviewConfig) {
        super(dataSource, contextMenuService, logger, renderer,
            translateService, factoryResolver, treeviewConfig);
    }
}

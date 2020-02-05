import {AfterViewInit, Component, ComponentFactoryResolver, Inject, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeviewItem} from 'ngx-treeview';
import {AbstractTreeviewComponent} from './abstract.treeview.component';

/**
 * Tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export class NgxTreeviewComponent extends AbstractTreeviewComponent<DataSource> implements AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxTreeviewComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param treeviewConfig {TreeviewConfig}
     * @param dropdown specify using drop-down tree-view or normal tree-view
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                treeviewConfig?: TreeviewConfig, dropdown?: boolean | false) {
        super(dataSource, contextMenuService, logger, renderer,
            translateService, factoryResolver, treeviewConfig, dropdown);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise when selected items have been changed
     * @param event event data
     */
    onSelectedChange(event: any): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelectedChange', event);
    }

    /**
     * Raise when tree-view filter has been changed
     * @param event event data
     */
    onFilterChange(event: any): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFilterChange', event);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Map the specified data from data-source to tree-view items to show
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('mappingDataSourceToTreeviewItems', data);
        return [];
    }
}
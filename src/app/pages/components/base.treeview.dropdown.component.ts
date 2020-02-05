import {Component, Inject, Renderer2} from '@angular/core';
import {NgxTreeviewComponent} from './treeview.component';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';

/**
 * Base tree-view component base on {DropdownTreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export abstract class BaseNgxDropdownTreeviewComponent<T extends DataSource> extends NgxTreeviewComponent {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseNgxDropdownTreeviewComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param treeviewConfig {TreeviewConfig}
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          treeviewConfig?: TreeviewConfig) {
        super(dataSource, contextMenuService, logger, renderer, translateService, treeviewConfig, true);
    }
}

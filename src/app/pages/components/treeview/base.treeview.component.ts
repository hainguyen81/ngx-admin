import {Component, ComponentFactoryResolver, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {NgxTreeviewComponent} from './treeview.component';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {ToasterService} from 'angular2-toaster';

/**
 * Base tree-view component base on {TreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
})
export abstract class BaseNgxTreeviewComponent<T extends DataSource> extends NgxTreeviewComponent {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    isDropDown(): boolean {
        return false;
    }

    protected setDropDown(dropdown?: boolean) {
        throwError('Unsupport changing dropdown property');
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseNgxTreeviewComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(ToasterService) toasterService: ToasterService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver, viewContainerRef);
    }
}

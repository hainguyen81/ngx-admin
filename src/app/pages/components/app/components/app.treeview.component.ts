import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {ModalDialogService} from 'ngx-modal-dialog';
import {IEvent} from '../../abstract.component';
import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Inject, Output, Renderer2, ViewContainerRef,} from '@angular/core';
import {AppTreeviewI18n, TOKEN_APP_TREEVIEW_SHOW_ALL} from './app.treeview.i18n';
import {ConfirmPopup} from 'ngx-material-popup';
import {BaseNgxTreeviewComponent} from '../../treeview/base.treeview.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from '@app/types/index';
import {IModel} from '../../../../@core/data/base';
import HierarchyUtils from '../../../../utils/common/hierarchy.utils';
import {ActivatedRoute, Router} from '@angular/router';

/**
 * Base tree-view component base on {TreeviewComponent}
 */
@Component({
    selector: 'ngx-tree-view-app',
    templateUrl: '../../treeview/treeview.component.html',
    styleUrls: ['../../treeview/treeview.component.scss'],
    providers: [
        {
            provide: TOKEN_APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: AppTreeviewI18n,
            deps: [TranslateService, TOKEN_APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export class AppTreeviewComponent<T extends IModel, D extends DataSource>
    extends BaseNgxTreeviewComponent<D>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private clickItemDelegate: (event: MouseEvent, item: TreeviewItem) => void;
    @Output() readonly dataSourceChanged: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Set the item click listener
     * @param clickItemDelegate listener
     */
    public setClickItemListener(clickItemDelegate: (event: MouseEvent, item: TreeviewItem) => void) {
        this.clickItemDelegate = clickItemDelegate;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppTreeviewComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     */
    constructor(@Inject(DataSource) dataSource: D,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise when tree-view item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {TreeviewItem}
     */
    onClickItem(event: IEvent) {
        super.onClickItem(event);
        this.clickItemDelegate
        && this.clickItemDelegate.apply(this, [event.event, event.data]);
    }

    /**
     * Perform action on data-source changed event
     * @param event {IEvent} that contains {$event} as changed values
     */
    onDataSourceChanged(event: IEvent) {
        super.onDataSourceChanged(event);
        this.dataSourceChanged.emit(event);
        let timer: number;
        timer = window.setTimeout(() => {
            this.focus();
            window.clearTimeout(timer);
        }, 300);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Delete the specified {TreeviewItem}
     * @param treeviewItem to delete
     * @return the deleted {TreeviewItem}
     */
    protected deleteItem(treeviewItem: TreeviewItem): TreeviewItem {
        return this.doDeleteItemFromDataSource(super.deleteItem(treeviewItem));
    }

    /**
     * Delete the specified {TreeviewItem} from data source
     * @param item to delete
     * @return the deleted item
     */
    private doDeleteItemFromDataSource(item: TreeviewItem): TreeviewItem {
        if (!item || !item.value) {
            return item;
        }

        // check for deleting children first
        if (item.children && item.children.length) {
            for (const it of item.children) {
                this.doDeleteItemFromDataSource(it);
            }
        }

        // if valid identity to delete
        if (item.value && (item.value['id'] || '').length) {
            this.getDataSource().remove(item.value)
                .then(() => this.getLogger().debug('DELETED?', item.value),
                    (errors) => this.getLogger().error(errors));
        }
        return item;
    }

    /**
     * Focus on tree-view
     */
    public focus(): void {
        let treeviewEls: NodeListOf<HTMLElement>;
        treeviewEls = this.getElementsBySelector(
            AppTreeviewComponent.TREEVIEW_ITEM_ELEMENT_SELECTOR);
        if (treeviewEls && treeviewEls.length) {
            this.toggleTreeviewItemElement(treeviewEls.item(0));

        } else {
            treeviewEls = this.getElementsBySelector(
                AppTreeviewComponent.TREEVIEW_ELEMENT_SELECTOR);
            if (treeviewEls && treeviewEls.length) {
                treeviewEls.item(0).focus();
            }
        }
    }

    /**
     * Mapping warehouse categories data to warehouse categories tree item
     * @param data to map
     */
    mappingDataSourceToTreeviewItems(data: any): TreeviewItem[] {
        return HierarchyUtils.buildModelTreeview(data as T[], 'name');
    }
}

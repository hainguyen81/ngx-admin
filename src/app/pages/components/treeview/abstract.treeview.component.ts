import {
    AfterViewInit,
    ComponentFactoryResolver,
    Inject,
    OnInit,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent, IEvent} from '../abstract.component';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {DropdownTreeviewComponent, TreeviewComponent, TreeviewItem} from 'ngx-treeview';

/* default tree-view config */
export const DefaultTreeviewConfig: TreeviewConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: true,
    hasFilter: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
});

/**
 * Abstract tree-view component base on {TreeviewComponent} and {DropdownTreeviewComponent}
 */
export abstract class AbstractTreeviewComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit, OnInit {

    protected static TREEVIEW_ELEMENT_SELECTOR: string = 'ngx-treeview';
    protected static TREEVIEW_ITEM_ELEMENT_SELECTOR: string = 'ngx-treeview-item';
    protected static TREEVIEW_SEARCH_ELEMENT_SELECTOR: string = '.row-filter';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(TreeviewComponent)
    private readonly queryTreeviewComponent: QueryList<TreeviewComponent>;
    private treeviewComponent: TreeviewComponent;

    @ViewChildren(DropdownTreeviewComponent)
    private readonly queryDropdownTreeviewComponent: QueryList<DropdownTreeviewComponent>;
    private dropdownTreeviewComponent: DropdownTreeviewComponent;

    /* tree-view items array */
    private treeviewItems: TreeviewItem[];
    /* drop-down button class */
    private buttonClass?: string | null;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating this component whether is drop-down tree-view component
     * @return true for drop-down; else false
     */
    public isDropDown(): boolean {
        return this.dropdown;
    }

    /**
     * Set a boolean value indicating this component whether is drop-down tree-view component
     * @param dropdown true for drop-down; else false
     */
    protected setDropDown(dropdown?: boolean | false) {
        this.dropdown = dropdown;
    }

    /**
     * Get the drop-down button class in drop-down tree-view mode
     * return the drop-down button class
     */
    public getButtonClass(): string {
        return this.buttonClass;
    }

    /**
     * Set the drop-down button class in drop-down tree-view mode
     * @param buttonClass to apply
     */
    public setButtonClass(buttonClass?: string) {
        this.buttonClass = buttonClass || '';
    }

    /**
     * Get the {TreeviewConfig} instance for configuring
     * @return the {TreeviewConfig} instance
     */
    public getConfig(): TreeviewConfig {
        return this.treeviewConfig || DefaultTreeviewConfig;
    }

    /**
     * Set the {TreeviewConfig} instance
     * @param cfg to apply. NULL for default
     */
    protected setConfig(cfg?: TreeviewConfig) {
        this.treeviewConfig = cfg || DefaultTreeviewConfig;
    }

    /**
     * Get the {TreeviewComponent} component
     * @return the {TreeviewComponent} component
     */
    protected getTreeviewComponent(): TreeviewComponent {
        return this.treeviewComponent;
    }

    /**
     * Get the {DropdownTreeviewComponent} component
     * @return the {DropdownTreeviewComponent} component
     */
    protected getDropdownTreeviewComponent(): DropdownTreeviewComponent {
        return this.dropdownTreeviewComponent;
    }

    /**
     * Get the tree-view items array to show
     * @return the tree-view items array
     */
    protected getTreeviewItems(): TreeviewItem[] {
        return this.treeviewItems || [];
    }

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
     * @param viewContainerRef {ViewContainerRef}
     * @param treeviewConfig {TreeviewConfig}
     * @param dropdown specify using drop-down tree-view or normal tree-view
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          private treeviewConfig?: TreeviewConfig,
                          private dropdown?: boolean | false) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver, viewContainerRef);
        this.setConfig(treeviewConfig);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.treeviewComponent && this.queryTreeviewComponent) {
            this.queryTreeviewComponent.map(
                (item) => {
                    this.treeviewComponent = item;
                    this.treeviewComponent
                    && this.treeviewComponent.selectedChange
                        .subscribe(value => this.onSelectedChange({$data: value}));
                    this.treeviewComponent
                    && this.treeviewComponent.filterChange
                        .subscribe(value => this.onFilterChange({$data: value}));
                });
        }
        if (!this.dropdownTreeviewComponent && this.queryDropdownTreeviewComponent) {
            this.queryDropdownTreeviewComponent.map(
                (item) => {
                    this.dropdownTreeviewComponent = item;
                    this.dropdownTreeviewComponent
                    && this.dropdownTreeviewComponent.selectedChange
                        .subscribe(value => this.onSelectedChange({$data: value}));
                    this.dropdownTreeviewComponent
                    && this.dropdownTreeviewComponent.filterChange
                        .subscribe(value => this.onFilterChange({$data: value}));
                });
        }
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise when selected items have been changed
     * @param event {IEvent} that contains {$data} as selected values
     */
    onSelectedChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelectedChange', event);
    }

    /**
     * Raise when tree-view filter has been changed
     * @param event {IEvent} that contains {$data} as filtered values
     */
    onFilterChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onFilterChange', event);
    }

    /**
     * Perform action on data-source changed event
     * @param event {IEvent} that contains {$event} as changed values
     */
    onDataSourceChanged(event: IEvent) {
        this.getLogger().debug('DataSource has been changed', event);
        if (event && event.$data && event.$data.hasOwnProperty('elements')) {
            this.treeviewItems = this.mappingDataSourceToTreeviewItems(event.$data['elements']);

        } else {
            this.treeviewItems = [];
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Map the specified data from data-source to tree-view items to show
     * @param data to map
     */
    abstract mappingDataSourceToTreeviewItems(data: any): TreeviewItem[];
}

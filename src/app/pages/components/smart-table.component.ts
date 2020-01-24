import {
    AfterViewInit,
    Component,
    Inject, Input,
    QueryList, TemplateRef,
    ViewChildren, ViewContainerRef, ViewRef,
} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {throwError} from 'rxjs';
import {MouseEventGuard} from './customization/mouse.event.guard';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {Ng2SmartTableComponent} from 'ng2-smart-table/ng2-smart-table.component';
import {Grid} from 'ng2-smart-table/lib/grid';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {isNumber} from 'util';

export interface IContextMenu {
    icon: (item?: any) => string;
    title: (item?: any) => string;
    enabled: (item?: any) => boolean;
    visible: (item?: any) => boolean;
    divider: (item?: any) => boolean;
    click: (item?: any) => void;
}

@Component({
    selector: 'ngx-smart-table',
    templateUrl: './smart-table.component.html',
    styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements AfterViewInit {

    private tableHeader: string;
    private settings = {
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
        },
        columns: {
            id: {
                title: 'ID',
                type: 'number',
            },
            firstName: {
                title: 'First Name',
                type: 'string',
            },
            lastName: {
                title: 'Last Name',
                type: 'string',
            },
            username: {
                title: 'Username',
                type: 'string',
            },
            email: {
                title: 'E-mail',
                type: 'string',
            },
            age: {
                title: 'Age',
                type: 'number',
            },
        },
    };

    @ViewChildren(ContextMenuComponent)
    private readonly queryContextMenuComponent: QueryList<ContextMenuComponent>;
    @Input() private contextMenuComponent: ContextMenuComponent;

    @ViewChildren('contextMenuComponent', {read: ViewContainerRef})
    private readonly queryContextMenuViewComponent: QueryList<ViewContainerRef>;
    private contextMenuViewComponent: ViewContainerRef;

    @ViewChildren(TemplateRef)
    private readonly queryContextMenuItemsComponent: QueryList<TemplateRef<any>>;
    private contextMenuItemsViewComponent: ViewRef;

    private contextMenu: IContextMenu[];

    @ViewChildren(Ng2SmartTableComponent)
    private readonly querySmartTableComponent: QueryList<Ng2SmartTableComponent>;
    private smartTableComponent: Ng2SmartTableComponent;

    constructor(@Inject(DataSource) private dataSource: DataSource,
                @Inject(ContextMenuService) private contextMenuService: ContextMenuService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        contextMenuService || throwError('Could not inject context menu service');
        logger || throwError('Could not inject logger');
        dataSource = dataSource || new LocalDataSource();
    }

    ngAfterViewInit(): void {
        this.queryContextMenuComponent.map(
            (item) => this.contextMenuComponent = item);
        this.querySmartTableComponent.map(
            (item) => this.smartTableComponent = item);
        this.queryContextMenuViewComponent.map(
            (item) => this.contextMenuViewComponent = item);
        this.queryContextMenuItemsComponent.map(
            (item) => this.contextMenuItemsViewComponent = item.createEmbeddedView(null));
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected setTableSettings(settings: any) {
        this.settings = settings;
    }

    protected setTableHeader(header: string) {
        this.tableHeader = header;
    }

    protected getDataSource(): DataSource {
        return this.dataSource;
    }

    protected setDataSource(dataSource: DataSource) {
        dataSource || throwError('Not found data source!');
        this.dataSource = dataSource;
    }

    protected getContextMenuService(): ContextMenuService {
        return this.contextMenuService;
    }

    protected getContextMenuViewComponent(): ViewContainerRef {
        return this.contextMenuViewComponent;
    }

    protected getContextMenuComponent(): ContextMenuComponent {
        return this.contextMenuComponent;
    }

    protected getContextMenuItemsViewComponent(): ViewRef {
        return this.contextMenuItemsViewComponent;
    }

    protected setContextMenu(contextMenu: IContextMenu[]) {
        (contextMenu && contextMenu.length) || throwError('Context menu must be valid');
        this.contextMenu = contextMenu;
    }

    protected getSmartTableComponent(): Ng2SmartTableComponent {
        return this.smartTableComponent;
    }

    protected getGridComponent(): Grid {
        return this.getSmartTableComponent().grid;
    }

    /**
     * Get the selected rows
     * @return selected rows array
     */
    public getSelectedRows(): Array<Row> {
        return this.getGridComponent().getSelectedRows();
    }

    /**
     * Get the rows
     * @return rows array
     */
    public getRows(): Array<Row> {
        return this.getGridComponent().getRows();
    }

    /**
     * Get the Row instance by the specified Row index
     * @param rowIdx to parse
     * @return Row or undefined
     */
    public getRowByIndex(rowIdx: number): Row {
        let rows: Array<Row>;
        rows = this.getRows();
        if (rows && rows.length && 0 <= rowIdx && rowIdx < rows.length) {
            return rows[rowIdx];
        }
        return undefined;
    }

    /**
     * Get the Row data by the specified row index
     * @param rowIdx to parse
     * @return Row data or undefined
     */
    public getRowDataByIndex(rowIdx: number): any {
        let row: Row;
        row = this.getRowByIndex(rowIdx);
        return (row ? row.getData() : undefined);
    }

    /**
     * Get the Row index by the specified Row data
     * @param item Row data
     * @param attr attribute to compare
     * @return Row index or -1
     */
    public getRowIndexByData(item: any, attr?: string): number {
        let rows: Array<Row>;
        rows = this.getRows();
        if (!item || !rows || !rows.length || (attr && attr.length && !item[attr])) {
            return -1;
        }
        for (const row of rows) {
            let rowData: any;
            rowData = row.getData();
            if (rowData && (rowData === item || rowData[attr] === item[attr])) {
                return rows.indexOf(row);
            }
        }
        return -1;
    }

    /**
     * Get the Row instance by the specified Row data
     * @param item Row data
     * @param attr attribute to compare
     * @return Row or undefined
     */
    public getRowByData(item: any, attr?: string): Row {
        let rowIndex: number;
        rowIndex = this.getRowIndexByData(item, attr);
        if (rowIndex < 0) {
            return undefined;
        }

        let rows: Array<Row>;
        rows = this.getGridComponent().getRows();
        return (rows && rows.length && rowIndex < rows.length ? rows[rowIndex] : undefined);
    }

    /**
     * Triggered once a row is selected (either clicked or selected automatically
     * (after page is changed, after some row is deleted, etc)).
     * @param event Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onRowSelect(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onRowSelect', event);
    }

    /**
     * Triggered only on a user click event.
     * @param event Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onUserRowSelect(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onUserRowSelect', event);
        if (MouseEventGuard.isDoubleClick()) {
            this.onDoubleClick(event);
        }
    }

    /**
     * Triggered only on a user double-click event from onUserRowSelect.
     * @param event Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onDoubleClick(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDoubleClick', event);
    }

    /**
     * Triggered only on a user mouseover event.
     * @param event Object, consist of:
     *      data: Object - highlighted row data object
     *      source: DataSource - table data source
     */
    onMouseOver(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMouseOver', event);
    }

    /**
     * Triggered once a Create button clicked.
     * Triggered only if table mode = external.
     * @param event Object, consist of:
     *      source: DataSource - table data source
     */
    onCreate(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onCreate', event);
    }

    /**
     * Triggered once a Create button clicked.
     * Triggered only if table confirmCreate = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event Object, consist of:
     *      newData: Object - data entered in a new row
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods.
     */
    onCreateConfirm(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onCreateConfirm', event);
    }

    /**
     * Triggered once an Edit button clicked on a row.
     * Triggered only if table mode = external.
     * @param event Object, consist of:
     *      data: Object - row data object
     *      source: DataSource - table data source
     */
    onEdit(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onEdit', event);
    }

    /**
     * Triggered once a Save button clicked.
     * Triggered only if table confirmSave = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event Object, consist of:
     *      data: Object - original row data
     *      newData: Object - edited data
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods.
     */
    onEditConfirm(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onEditConfirm', event);
    }

    /**
     * Triggered once a Delete button clicked on a row.
     * Triggered only if table mode = external.
     * @param event Object, consist of:
     *      data: Object - row data object
     *      source: DataSource - table data source
     */
    onDelete(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDelete', event);
    }

    /**
     * Triggered once a Delete button clicked.
     * Triggered only if table confirmDelete = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event Object, consist of:
     *      data: Object - data object to delete
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve() and reject() methods.
     */
    onDeleteConfirm(event): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDeleteConfirm', event);
    }

    /**
     * Triggered ContextMenu.
     * @param event MouseEvent
     */
    onContextMenu(event: MouseEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenu', event);
        let rowIdx: number;
        rowIdx = -1;
        let target: HTMLElement;
        target = event.target as HTMLElement;
        target = (target && target.tagName.toLowerCase() === 'tr'
            ? target : target.closest('tr'));
        if (target && target.tagName.toLowerCase() === 'tr'
            && isNumber(target['rowIndex'])) {
            rowIdx = target['rowIndex'] as number;
            rowIdx -= 1;
        }
        if (rowIdx >= 0) {
            this.getContextMenuService().show.next({
                // Optional - if unspecified, all context menu components will open
                contextMenu: this.contextMenuComponent,
                event: event,
                item: this.getRowDataByIndex(rowIdx),
                anchorElement: event.target,
            });
            event.preventDefault();
            event.stopPropagation();

        } else {
            this.closeContextMenu();
        }
    }

    protected closeContextMenu() {
        const keyEvent = new KeyboardEvent('keydown', {key: 'Escape'});
        this.getContextMenuService().closeAllContextMenus({
            eventType: 'cancel',
            event: keyEvent,
        });
    }

    /**
     * Triggered closed ContextMenu.
     */
    onContextMenuClose(): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onContextMenuClose');
    }

    /**
     * Perform search action
     * @param keyword to search
     */
    onSearch(keyword?: any) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSearch');
    }

    protected editRowByIndex(rowIndex: number) {
        this.editRow(this.getRowByIndex(rowIndex));
    }

    protected editRowByData(item: any, attr?: string) {
        this.editRow(this.getRowByData(item, attr));
    }

    protected editRow(row: Row) {
        row && this.getGridComponent().selectRow(row);
        row && this.getGridComponent().edit(row);
        !row && this.getLogger().warn('Undefined row to edit');
    }
}

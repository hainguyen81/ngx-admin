import {
    AfterViewInit,
    Component,
    Inject, Input,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {Cell, LocalDataSource} from 'ng2-smart-table';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {throwError} from 'rxjs';
import {MouseEventGuard} from './customization/mouse.event.guard';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {Ng2SmartTableComponent} from 'ng2-smart-table/ng2-smart-table.component';
import {Grid} from 'ng2-smart-table/lib/grid';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {isNumber} from 'util';
import {
    DocumentKeydownHandlerService,
    DocumentKeypressHandlerService,
    DocumentKeyupHandlerService,
} from '../../services/implementation/document.keypress.handler.service';

export const FOCUSABLE_ELEMENTS_SELETOR: string =
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';

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

    private static SMART_TABLE_CELLS_SELECTOR: string = 'ng2-smart-table-cell';

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
    private contextMenuComponent: ContextMenuComponent;

    private contextMenu: IContextMenu[];

    @ViewChildren(Ng2SmartTableComponent)
    private readonly querySmartTableComponent: QueryList<Ng2SmartTableComponent>;
    private smartTableComponent: Ng2SmartTableComponent;

    private documentKeyDownHandlerService: DocumentKeydownHandlerService;
    private documentKeyUpHandlerService: DocumentKeyupHandlerService;
    private documentKeyPressHandlerService: DocumentKeypressHandlerService;

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
        this.documentKeyDownHandlerService = new DocumentKeydownHandlerService(
            (e: KeyboardEvent) => this.onKeyDown(e), this.getLogger());
        this.documentKeyUpHandlerService = new DocumentKeyupHandlerService(
            (e: KeyboardEvent) => this.onKeyUp(e), this.getLogger());
        this.documentKeyPressHandlerService = new DocumentKeypressHandlerService(
            (e: KeyboardEvent) => this.onKeyPress(e), this.getLogger());
    }

    protected getDocumentKeyDownHandlerService(): DocumentKeydownHandlerService {
        this.documentKeyDownHandlerService || throwError('Could not handle document keydown');
        return this.documentKeyDownHandlerService;
    }

    protected getDocumentKeyUpHandlerService(): DocumentKeyupHandlerService {
        this.documentKeyUpHandlerService || throwError('Could not handle document keyup');
        return this.documentKeyUpHandlerService;
    }

    protected getDocumentKeyPressHandlerService(): DocumentKeypressHandlerService {
        this.documentKeyPressHandlerService || throwError('Could not handle document keypress');
        return this.documentKeyPressHandlerService;
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

    protected getContextMenuComponent(): ContextMenuComponent {
        return this.contextMenuComponent;
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

    /**
     * Support for closing all context menu
     */
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

    /**
     * Perform keydown action
     * @param event KeyboardEvent
     */
    onKeyDown(event: KeyboardEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyDown');
    }

    /**
     * Perform keyup action
     * @param event KeyboardEvent
     */
    onKeyUp(event: KeyboardEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyUp');
    }

    /**
     * Perform keypress action
     * @param event KeyboardEvent
     */
    onKeyPress(event: KeyboardEvent) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyPress');
    }

    /**
     * Support to detect the specified KeyboardEvent whether is raised from the specified keys array
     * @param e to parse key
     * @param detectedKeys to detect
     * @return true for the event whether came from one of the specified keys; else false
     */
    protected isSpecifiedKey(e: KeyboardEvent, ...detectedKeys: any[]): boolean {
        if (!e || !detectedKeys || !detectedKeys.length) {
            return false;
        }
        const key = e.key || e.keyCode;
        return (detectedKeys.indexOf(key) >= 0);
    }

    /**
     * Get the Cell by row and column indexes
     * @param rowIndex to detect Cell. base on 0
     * @param columnIndex to detect Cell. base on 0
     * @return Cell or undefined
     */
    protected getCellByIndex(rowIndex: number, columnIndex: number): Cell {
        let row: Row;
        row = this.getRowByIndex(rowIndex);
        if (row && row.cells && row.cells.length && columnIndex < row.cells.length) {
            return row.cells[columnIndex];
        }
        return undefined;
    }

    /**
     * Get the Cell by row index and property identity
     * @param rowIndex to detect Cell. base on 0
     * @param propertyId to detect Cell
     * @return Cell or undefined
     */
    protected getCellByProperty(rowIndex: number, propertyId: string): Cell {
        let row: Row;
        row = this.getRowByIndex(rowIndex);
        if (row && row.cells && row.cells.length && (propertyId || '').length) {
            for (const cell of row.cells) {
                if (cell.getId().toLowerCase() === propertyId.toLowerCase()) {
                    return cell;
                }
            }
        }
        return undefined;
    }

    /**
     * Get the Cell editor of the specified Cell
     * @param cell to detect Cell editor
     * @return HTMLElement or undefined
     */
    protected getCellEditor(cell: Cell): HTMLElement {
        let row: Row;
        let columnIndex: number;
        row = (cell ? cell.getRow() : undefined);
        columnIndex = (row ? row.cells.indexOf(cell) : -1);
        if (cell && cell.isEditable() && row && row.isInEditing && 0 <= columnIndex) {
            let cells: NodeListOf<HTMLTableCellElement>;
            cells = document.querySelectorAll(SmartTableComponent.SMART_TABLE_CELLS_SELECTOR);
            let editors: NodeListOf<HTMLElement>;
            editors = cells[columnIndex].querySelectorAll(FOCUSABLE_ELEMENTS_SELETOR);
            if (editors && editors.length) {
                return editors.item(0);
            }
        }
        return undefined;
    }

    /**
     * Get the Cell editor by row and column indexes
     * @param rowIndex to detect Cell. base on 0
     * @param columnIndex to detect Cell. base on 0
     * @return HTMLElement or undefined
     */
    protected getCellEditorByIndex(rowIndex: number, columnIndex: number): HTMLElement {
        return this.getCellEditor(this.getCellByIndex(rowIndex, columnIndex));
    }

    /**
     * Get the Cell editor by row index and property identity
     * @param rowIndex to detect Cell. base on 0
     * @param propertyId to detect Cell
     * @return HTMLElement or undefined
     */
    protected getCellEditorByProperty(rowIndex: number, propertyId: string): HTMLElement {
        return this.getCellEditor(this.getCellByProperty(rowIndex, propertyId));
    }

    /**
     * Put the specified Row index into editing mode
     * @param rowIndex to edit
     */
    protected editRowByIndex(rowIndex: number) {
        this.editRow(this.getRowByIndex(rowIndex));
    }

    /**
     * Put the Row that contains the specified data (incl. data's attribute) into editing mode
     * @param item to edit
     * @param attr to detect Row
     */
    protected editRowByData(item: any, attr?: string) {
        this.editRow(this.getRowByData(item, attr));
    }

    /**
     * Put the specified Row into editing mode
     * @param row to edit
     */
    protected editRow(row: Row) {
        if (row && row.isInEditing) {
            return;
        }

        row && this.getGridComponent().selectRow(row);
        row && this.getGridComponent().edit(row);
        if (row && row.cells && row.cells.length && row.isInEditing) {
            // wait for showing editor
            setTimeout(() => {
                for (let i = 0; i < row.cells.length; i++) {
                    if (row.cells[i].isEditable()) {
                        let cellEditor: HTMLElement;
                        cellEditor = this.getCellEditorByIndex(row.index, i);
                        this.getLogger().debug('Cell editor', cellEditor);
                        if (cellEditor) {
                            cellEditor.focus({preventScroll: false});
                            break;
                        }
                    }
                }
            }, 300);
        }
        !row && this.getLogger().warn('Undefined row to edit');
    }

    /**
     * Create new Row
     */
    protected newRow() {
        this.getGridComponent().selectRow(this.getGridComponent().getNewRow());
    }

    /**
     * Put the specified Row index out of editing mode
     * @param rowIndex to cancel editing
     */
    protected cancelEditRowByIndex(rowIndex: number) {
        this.cancelEditRow(this.getRowByIndex(rowIndex));
    }

    /**
     * Put the Row that contains the specified data (incl. data's attribute) out of editing mode
     * @param item to cancel editing
     * @param attr to detect Row
     */
    protected cancelEditRowByData(item: any, attr?: string) {
        this.cancelEditRow(this.getRowByData(item, attr));
    }

    /**
     * Put the specified Row out of editing mode
     * @param row to cancel editing
     */
    protected cancelEditRow(row: Row) {
        !row && this.getLogger().warn('Undefined row to cancel');
        if (row && !row.isInEditing) {
            return;
        } else if (row) {
            row.isInEditing = false;
        }
    }

    /**
     * Put the specified rows out of editing mode
     * @param rows to cancel editing
     */
    protected cancelEditRows(rows: Array<Row>) {
        if (rows && rows.length) {
            rows.forEach((row) => this.cancelEditRow(row));
        }
    }

    /**
     * Cancel all editing rows
     */
    protected cancelEditAll() {
        this.cancelEditRows(this.getRows());
    }
}

import {AfterViewInit, Component, EventEmitter, Inject, QueryList, ViewChildren,} from '@angular/core';
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
import {DocumentKeydownHandlerService, DocumentKeypressHandlerService, DocumentKeyupHandlerService,} from '../../services/implementation/document.keypress.handler.service';

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

    private static SMART_TABLE_ROW_SELETOR: string = 'ng2-smart-row';
    private static SMART_TABLE_CELLS_SELECTOR: string = 'ng2-smart-table-cell';

    private tableHeader: string;
    private settings = {
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmSave: true,
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
     * Get the Row instance by the specified DOM event
     * @param event DOM event
     * @return Row or undefined
     */
    public getRowByEvent(event: Event): Row {
        let rowIdx: number;
        rowIdx = -1;
        let target: HTMLElement;
        target = event.target as HTMLElement;
        target = (target && target.tagName.toLowerCase() === 'tr'
            ? target : target ? target.closest('tr') : undefined);
        if (target && target.tagName.toLowerCase() === 'tr'
            && isNumber(target['rowIndex'])) {
            rowIdx = target['rowIndex'] as number;
            rowIdx -= 1;
        }
        return this.getRowByIndex(rowIdx);
    }

    /**
     * Get the Cell instance by the specified DOM event
     * @param event DOM event
     * @return Cell or undefined
     */
    public getCellByEvent(event: Event): Cell {
        let rowIndex: number;
        let cellIndex: number;
        rowIndex = -1;
        cellIndex = -1;

        let target: HTMLElement;
        let targetCell: HTMLElement;
        let targetRow: HTMLElement;
        target = event.target as HTMLElement;
        targetCell = (target && target.tagName.toLowerCase() === 'td'
            ? target : target ? target.closest('td') : undefined);
        targetRow = (target && target.tagName.toLowerCase() === 'tr'
            ? target : targetCell ? targetCell.closest('tr')
                : target ? target.closest('tr') : undefined);
        if (targetRow && targetRow.tagName.toLowerCase() === 'tr'
            && isNumber(targetRow['rowIndex'])) {
            rowIndex = targetRow['rowIndex'] as number;
            rowIndex -= 1;
        }
        if (targetCell && targetCell.tagName.toLowerCase() === 'td'
            && isNumber(targetCell['cellIndex'])) {
            cellIndex = targetCell['cellIndex'] as number;
        }
        return (rowIndex >= 0 && cellIndex >= 0 ? this.getCellByIndex(rowIndex, cellIndex) : undefined);
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
        if (event instanceof MouseEvent) {
            let cell: Cell;
            cell = this.getCellByEvent(event);
            this.getLogger().debug('onDoubleClick', event, cell);
            if (cell) {
                this.editCell(cell);
            }
            this.preventEvent(event);

        } else if (event.data) {
            this.getLogger().debug('onDoubleClick', event);
            this.editRow(event.data);
        }
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
     * Triggered click event
     * @param event MouseEvent
     */
    onClick(event: MouseEvent): void {
        // TODO Waiting for implementing from children component
        let row: Row;
        row = this.getRowByEvent(event);
        this.getLogger().debug('onClick', event, row);
        if (row) {
            this.getGridComponent().selectRow(row);
            this.attachSelectedRowClass(row.index, true);

            // stop firing event
            this.preventEvent(event);
        }
    }

    /**
     * Triggered ContextMenu.
     * @param event MouseEvent
     */
    onContextMenu(event: MouseEvent): void {
        // TODO Waiting for implementing from children component
        let row: Row;
        row = this.getRowByEvent(event);
        this.getLogger().debug('onContextMenu', event, row);
        if (row) {
            this.getContextMenuService().show.next({
                // Optional - if unspecified, all context menu components will open
                contextMenu: this.contextMenuComponent,
                event: event,
                item: row.getData(),
                anchorElement: event.target,
            });

        } else {
            this.closeContextMenu();
        }

        // stop firing event
        this.preventEvent(event);
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
    onSearch(keyword?: any): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSearch');
    }

    /**
     * Perform keydown action
     * @param event KeyboardEvent
     */
    onKeyDown(event: KeyboardEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyDown');
    }

    /**
     * Perform keyup action
     * @param event KeyboardEvent
     */
    onKeyUp(event: KeyboardEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyUp');
    }

    /**
     * Perform keypress action
     * @param event KeyboardEvent
     */
    onKeyPress(event: KeyboardEvent): void {
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
        return (detectedKeys.indexOf(key) >= 0 || detectedKeys.indexOf(e.keyCode) >= 0);
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
                if (cell.getId() && cell.getId().toLowerCase() === propertyId.toLowerCase()) {
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

        row && this.editCellByIndex(row.index, -1);
        !row && this.getLogger().warn('Undefined row to edit');
    }

    /**
     * Put the specified Cell into editing mode.
     * It means whole Row will be in editing mode.
     * @param rowIndex to edit
     * @param columnIndex to edit. -1 for focus the first cell
     */
    protected editCellByIndex(rowIndex: number, columnIndex: number) {
        if (0 > rowIndex || -1 > columnIndex) {
            return;
        }

        let row: Row;
        row = this.getRowByIndex(rowIndex);
        if (!row || row.isInEditing || !row.cells || !row.cells.length || columnIndex >= row.cells.length) {
            return;
        }

        let cell: Cell;
        cell = (columnIndex < 0 ? undefined : row.cells[columnIndex]);
        this.getGridComponent().selectRow(row);
        this.attachSelectedRowClass(row.index, true);
        this.getGridComponent().edit(row);

        // wait for showing editor
        setTimeout(() => {
            let cellEditor: HTMLElement;
            if (!cell || !cell.isEditable()) {
                for (let i = 0; i < row.cells.length; i++) {
                    if (row.cells[i].isEditable()) {
                        cellEditor = this.getCellEditorByIndex(row.index, i);
                        this.getLogger().debug('Cell editor', cellEditor);
                        if (cellEditor) {
                            break;
                        }
                    }
                }
            } else {
                cellEditor = this.getCellEditorByIndex(row.index, columnIndex);
                this.getLogger().debug('Cell editor', cellEditor);
            }

            if (cellEditor) {
                cellEditor.focus({preventScroll: false});
                (typeof cellEditor['select'] === 'function') && cellEditor['select'].apply(cellEditor);
            }
        }, 300);
    }

    /**
     * Put the specified Cell into editing mode.
     * It means whole Row will be in editing mode
     * @param cell to edit
     */
    protected editCell(cell: Cell) {
        if (!cell || !cell.getRow() || cell.getRow().isInEditing) {
            return;
        }
        this.editCellByIndex(cell.getRow().index, cell.getRow().cells.indexOf(cell));
    }

    /**
     * Save the specified Row
     * @param rowIndex to save
     */
    protected saveRowByIndex(rowIndex: number) {
        this.saveRow(this.getRowByIndex(rowIndex));
    }

    /**
     * Save the specified Row
     * @param item to save
     * @param attr to detect Row
     */
    protected saveRowByData(item: any, attr?: string) {
        this.saveRow(this.getRowByData(item, attr));
    }

    /**
     * Save the specified Row
     * @param row to save
     */
    protected saveRow(row: Row) {
        if (row && !row.isInEditing) {
            return;
        }

        row && this.getGridComponent().save(row,
            this.getSmartTableComponent().editConfirm || new EventEmitter<any>());
        !row && this.getLogger().warn('Undefined row to edit');
    }

    /**
     * Save the specified Row array
     * @param rows to save
     */
    protected saveRows(rows: Array<Row>) {
        if (!rows || !rows.length) {
            return;
        }

        let editingRows: Array<Row>;
        editingRows = [];
        rows.forEach((row) => {
            if (row.isInEditing) {
                editingRows.push(row);
            }
        });
        if (!editingRows.length) {
            return;
        }

        editingRows.forEach((row) => this.saveRow(row));
    }

    /**
     * Save the editing Row array in the selected rows
     */
    protected saveSelectedRows() {
        return this.saveRows(this.getSelectedRows());
    }

    /**
     * Save the editing Row array in all rows
     */
    protected saveAllRows() {
        return this.saveRows(this.getRows());
    }

    /**
     * Delete the specified Row
     * @param rowIndex to delete
     */
    protected deleteRowByIndex(rowIndex: number) {
        this.deleteRow(this.getRowByIndex(rowIndex));
    }

    /**
     * Delete the specified Row
     * @param item to delete
     * @param attr to detect Row
     */
    protected deleteRowByData(item: any, attr?: string) {
        this.deleteRow(this.getRowByData(item, attr));
    }

    /**
     * Delete the specified Row
     * @param row to delete
     */
    protected deleteRow(row: Row) {
        if (row) {
            return;
        }

        row && this.getGridComponent().delete(row,
            this.getSmartTableComponent().deleteConfirm || new EventEmitter<any>());
        !row && this.getLogger().warn('Undefined row to edit');
    }

    /**
     * Delete the specified Row array
     * @param rows to delete
     */
    protected deleteRows(rows: Array<Row>) {
        if (!rows || !rows.length) {
            return;
        }
        rows.forEach((row) => this.deleteRow(row));
    }

    /**
     * Delete the selected rows
     */
    protected deleteSelectedRows() {
        return this.deleteRows(this.getSelectedRows());
    }

    /**
     * Delete all rows
     */
    protected deleteAllRows() {
        return this.deleteRows(this.getRows());
    }

    /**
     * Create new Row
     */
    protected newRow() {
        let newRow: Row;
        newRow = this.getGridComponent().getNewRow();
        this.getGridComponent().selectRow(newRow);
        this.attachSelectedRowClass(newRow.index, true);
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
     * @param refresh specify whether need to refresh data source
     */
    protected cancelEditRow(row: Row, refresh?: boolean) {
        !row && this.getLogger().warn('Undefined row to cancel');
        if (row && !row.isInEditing) {
            return;

        } else if (row) {
            row.isInEditing = false;
            if (refresh) {
                this.getGridComponent().source.refresh();
            }
            this.getGridComponent().selectRow(row);
            this.attachSelectedRowClass(row.index, true);
        }
    }

    /**
     * Put the specified rows out of editing mode
     * @param rows to cancel editing
     */
    protected cancelEditRows(rows: Array<Row>) {
        if (rows && rows.length) {
            rows.forEach((r) => this.cancelEditRow(r, false));
            this.getGridComponent().source.refresh();

            let row: Row;
            row = rows.shift();
            this.getGridComponent().selectRow(row);
            this.attachSelectedRowClass(row.index, true);
        }
    }

    /**
     * Cancel all editing rows
     */
    protected cancelEditAll() {
        this.cancelEditRows(this.getRows());
    }

    /**
     * Prevent the specified event
     * @param event to prevent
     */
    protected preventEvent(event: any) {
        (event && typeof event.preventDefault === 'function') && event.preventDefault();
        (event && typeof event.stopPropagation === 'function') && event.stopPropagation();
        if (event) {
            event['cancelBubble'] = true;
            event['returnValue'] = false;
        }
    }

    /**
     * Add/Remove selected class for the specified row index
     * @param rowIndex to select
     * @param add true for adding selected class; else removing it
     */
    private attachSelectedRowClass(rowIndex: number, add?: boolean | true) {
        if (0 > rowIndex) {
            return;
        }

        let rows: NodeListOf<HTMLTableRowElement>;
        rows = document.querySelectorAll(SmartTableComponent.SMART_TABLE_ROW_SELETOR);
        if (!rows || !rows.length || rowIndex >= rows.length) {
            return;
        }

        let row: HTMLTableRowElement;
        row = rows.item(rowIndex);
        if (!row.classList || (add && row.classList.contains('selected'))
            || (!add && !row.classList.contains('selected'))) {
            return;
        }

        if (this.getGridComponent().getSetting('selectMode') !== 'multi' && add) {
            rows.forEach((r) => r.classList.remove('selected'));
        }

        if (add) {
            row.classList.add('selected');

        } else if (row.classList.contains('selected')) {
            row.classList.remove('selected');
        }
    }
}

import {
    AfterViewInit,
    Component,
    EventEmitter,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
} from '@angular/core';
import {Cell, LocalDataSource} from 'ng2-smart-table';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {throwError} from 'rxjs';
import {MouseEventGuard} from './customization/mouse.event.guard';
import {ContextMenuComponent, ContextMenuService, IContextMenuClickEvent} from 'ngx-contextmenu';
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
import HtmlUtils from '../../utils/html.utils';
import KeyboardUtils from '../../utils/keyboard.utils';

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

    protected static SMART_TABLE_ROW_SELETOR: string = 'ng2-smart-table table tbody tr';
    protected static SMART_TABLE_CELLS_SELECTOR: string = 'ng2-smart-table-cell';
    protected static SMART_TABLE_CELLS_EDIT_MODE_SELECTOR: string = 'table-cell-edit-mode';
    protected static CONTEXT_MENU_SELECTOR: string = '.ngx-contextmenu';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

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
        rowClassFunction: (row) => '',
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

    private edittingRows: Array<Row> = [];
    private allowMultiEdit: boolean = false;

    constructor(@Inject(DataSource) private dataSource: DataSource,
                @Inject(ContextMenuService) private contextMenuService: ContextMenuService,
                @Inject(NGXLogger) private logger: NGXLogger,
                private renderer: Renderer2) {
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

    // -------------------------------------------------
    // GETTER/SETTER
    // -------------------------------------------------

    public allowMultipleEdit(): boolean {
        return this.allowMultiEdit || false;
    }

    public setAllowMultipleEdit(allow?: boolean | false) {
        let changed: boolean;
        changed = (this.allowMultiEdit !== allow);
        this.allowMultiEdit = allow || false;
        if (!allow && changed && this.getEditingRows().length > 1) {
            // exclude the latest editing row
            this.getEditingRows().pop();
            // cancel all editing rows
            this.cancelEditRows(this.getEditingRows());
        }
    }

    protected getRenderer(): Renderer2 {
        return this.renderer;
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
     * Get the current editing Row array
     * @return the current editing Row array or empty
     */
    protected getEditingRows(): Array<Row> {
        return this.edittingRows || [];
    }

    /**
     * Get the current editing Row DOM elements array
     * @return the current editing Row DOM elements array
     */
    protected getEditingRowElements(): Array<HTMLTableRowElement> {
        let editRows: Array<Row>;
        editRows = this.getEditingRows();
        if (!editRows || !editRows.length) {
            return undefined;
        }

        let editingRowEls: Array<HTMLTableRowElement>;
        editingRowEls = [];
        let rowEls: NodeListOf<HTMLTableRowElement>;
        rowEls = this.getAllRowElements();
        editRows.forEach(r => editingRowEls.push(rowEls.item(r.index)));
        return editingRowEls;
    }

    /**
     * Get a boolean value indicating whether is in EDIT mode
     * @return true for being in EDIT mode; else false
     */
    public isInEditMode(): boolean {
        let editingRows: Array<Row>;
        editingRows = this.getEditingRows();
        return (editingRows && editingRows.length > 0);
    }

    /**
     * Get a boolean value indicating the specified Row whether is in EDIT mode
     * @return true for being in EDIT mode; else false
     */
    public isRowInEditMode(row: Row): boolean {
        return (row && row.isInEditing);
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
    protected getRowByEvent(event: Event): Row {
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
     * Get the Row DOM elements by the specified selector
     * @return Row DOM elements or undefined
     */
    protected getRowElementsBySelector(selector: string): NodeListOf<HTMLTableRowElement> {
        return HtmlUtils.getElementsBySelector(selector) as NodeListOf<HTMLTableRowElement>;
    }

    /**
     * Get the all Row DOM elements
     * @return Row DOM elements or undefined
     */
    protected getAllRowElements(): NodeListOf<HTMLTableRowElement> {
        return this.getRowElementsBySelector(SmartTableComponent.SMART_TABLE_ROW_SELETOR);
    }

    /**
     * Get the Row DOM element by the specified Row data and attribute
     * @param item data to detect Row
     * @param attr data attribute to detect Row
     * @return Row or undefined
     */
    public getRowElementByData(item: any, attr?: string): HTMLTableRowElement {
        return this.getRowElement(this.getRowByData(item, attr));
    }

    /**
     * Get the Row DOM element by the specified Row index
     * @param rowIndex to detect
     * @return Row or undefined
     */
    public getRowElementByIndex(rowIndex: number): HTMLTableRowElement {
        return this.getRowElement(this.getRowByIndex(rowIndex));
    }

    /**
     * Get the Row DOM element by the specified Row
     * @param row to detect
     * @return Row or undefined
     */
    public getRowElement(row: Row): HTMLTableRowElement {
        if (!row) {
            return;
        }

        let rows: NodeListOf<HTMLTableRowElement>;
        rows = this.getAllRowElements();
        if (!rows || !rows.length || row.index >= rows.length || !this.getRenderer()) {
            return;
        }

        return rows.item(row.index);
    }

    /**
     * Get the Row instance by the specified Row DOM element
     * @param rowEl to detect Row
     * @return Row or undefined
     */
    public getRowByElement(rowEl: HTMLTableRowElement): Row {
        if (!rowEl || rowEl.tagName.toLowerCase() !== 'tr') {
            return undefined;
        }

        let cell: Cell;
        cell = this.getCellByElement(rowEl.cells.item(0));
        if (!cell && rowEl.rowIndex > 0) {
            cell = this.getCellByIndex(rowEl.rowIndex - 1, 0);
        }
        return (cell ? cell.getRow() : undefined);
    }

    /**
     * Get the Cell instance by the specified DOM event
     * @param event DOM event
     * @return Cell or undefined
     */
    protected getCellByEvent(event: Event): Cell {
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
     * Get the Cell by row and column indexes
     * @param rowIndex to detect Cell. base on 0
     * @param columnIndex to detect Cell. base on 0
     * @return Cell or undefined
     */
    public getCellByIndex(rowIndex: number, columnIndex: number): Cell {
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
    public getCellByProperty(rowIndex: number, propertyId: string): Cell {
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
    public getCellEditor(cell: Cell): HTMLElement {
        let row: Row;
        let columnIndex: number;
        row = (cell ? cell.getRow() : undefined);
        columnIndex = (row ? row.cells.indexOf(cell) : -1);
        if (cell && cell.isEditable() && row && row.isInEditing && 0 <= columnIndex) {
            let cells: NodeListOf<HTMLElement>;
            cells = HtmlUtils.getElementsBySelector(SmartTableComponent.SMART_TABLE_CELLS_EDIT_MODE_SELECTOR);
            let editors: NodeListOf<HTMLElement>;
            editors = HtmlUtils.getFocusableElements(cells[columnIndex]);
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
    public getCellEditorByIndex(rowIndex: number, columnIndex: number): HTMLElement {
        return this.getCellEditor(this.getCellByIndex(rowIndex, columnIndex));
    }

    /**
     * Get the Cell editor by row index and property identity
     * @param rowIndex to detect Cell. base on 0
     * @param propertyId to detect Cell
     * @return HTMLElement or undefined
     */
    public getCellEditorByProperty(rowIndex: number, propertyId: string): HTMLElement {
        return this.getCellEditor(this.getCellByProperty(rowIndex, propertyId));
    }

    /**
     * Get the Cell instance by the specified Cell DOM element
     * @param cellEl to detect Cell
     * @return Cell or undefined
     */
    public getCellByElement(cellEl: HTMLTableCellElement): Cell {
        if (!cellEl || cellEl.tagName.toLowerCase() !== 'td') {
            return undefined;
        }

        let cellEls: NodeListOf<HTMLTableCellElement>;
        cellEls = HtmlUtils.getElementsBySelector(
            SmartTableComponent.SMART_TABLE_CELLS_SELECTOR) as NodeListOf<HTMLTableCellElement>;
        if (!cellEls || !cellEls.length) {
            return undefined;
        }

        let cellElRowIndex: number;
        let cellElColIndex: number;
        cellElRowIndex = -1;
        cellElColIndex = -1;
        for (let i: number = 0; i < cellEls.length; i++) {
            if (cellEl === cellEls.item(i)) {
                cellElRowIndex = cellEls.item(i).closest('tr').rowIndex - 1;
                cellElColIndex = cellEls.item(i).cellIndex;
                break;
            }
        }
        return (cellElRowIndex >= 0 && cellElColIndex >= 0
            ? this.getCellByIndex(cellElRowIndex, cellElColIndex) : undefined);
    }

    // -------------------------------------------------
    // EVENT
    // -------------------------------------------------

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
            this.selectRow(row);

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
        if (this.showHideContextMenuOnRow(row, event)) {
            // stop firing event
            this.preventEvent(event);
        }
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
        this.getLogger().debug('onKeyDown', event);
        if (KeyboardUtils.isNavigateKey(event) && !this.isInEditMode()) {
            // handle navigation keys
            this.onRowNavigate(event);

        } else if (KeyboardUtils.isContextMenuKey(event) && !this.isInEditMode()) {
            const hoveredRowsSelector: string =
                [SmartTableComponent.SMART_TABLE_ROW_SELETOR, '.hover'].join('');
            let hoveredRows: NodeListOf<HTMLTableRowElement>;
            hoveredRows = this.getRowElementsBySelector(hoveredRowsSelector);
            let row: Row;
            row = (hoveredRows && hoveredRows.length
                ? this.getRowByElement(hoveredRows.item(0)) : undefined);
            if (this.showHideContextMenuOnRow(row, event)) {
                // stop firing event
                this.preventEvent(event);
            }
        }
    }

    /**
     * Perform navigation keys action
     * @param event KeyboardEvent
     */
    onRowNavigate(event: KeyboardEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onRowNavigate');

        // check whether navigating on context menu
        let targetEl: HTMLElement;
        targetEl = event.target as HTMLElement;
        if (targetEl && targetEl.closest(SmartTableComponent.CONTEXT_MENU_SELECTOR)) {
            return;
        } else {
            // close context menu if necessary
            this.closeContextMenu();
        }

        let rows: NodeListOf<HTMLTableRowElement>;
        rows = this.getAllRowElements();
        if (!rows || !rows.length) {
            return;
        }

        // detect the latest hovered row element
        let hoveredRowIndex: number;
        hoveredRowIndex = -1;
        for (let i: number = 0; i < rows.length; i++) {
            let r: HTMLTableRowElement;
            r = rows.item(i);
            if (r.classList && r.classList.contains('hover')) {
                hoveredRowIndex = i;
                break;
            }
        }
        if (hoveredRowIndex < 0) {
            this.toggleRowElementClass(rows.item(0), 'hover', true);

        } else {
            // toggle hover class
            this.toggleRowElementClass(rows.item(hoveredRowIndex), 'hover', false);
            if (KeyboardUtils.isHomeKey(event) || KeyboardUtils.isPageUpKey(event)
                || (hoveredRowIndex + 1 >= rows.length && KeyboardUtils.isDownKey(event))) {
                hoveredRowIndex = 0;

            } else if (KeyboardUtils.isEndKey(event) || KeyboardUtils.isPageDownKey(event)
                || (hoveredRowIndex - 1 < 0 && KeyboardUtils.isUpKey(event))) {
                hoveredRowIndex = rows.length - 1;

            } else if (KeyboardUtils.isUpKey(event)) {
                hoveredRowIndex -= 1;

            } else {
                hoveredRowIndex += 1;
            }
            this.toggleRowElementClass(rows.item(hoveredRowIndex), 'hover', true);
        }
        this.preventEvent(event);
    }

    /**
     * Perform keyup action
     * @param event KeyboardEvent
     */
    onKeyUp(event: KeyboardEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onKeyUp', event);
        if (KeyboardUtils.isContextMenuKey(event)) {
            // stop firing event
            this.preventEvent(event);
        }
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
     * Perform action on menu item has been clicked
     * @param event Object, consist of:
     *      event: action event
     *      item: menu item data
     * @param menuItem IContextMenu that has been activated
     */
    onMenuEvent(event, menuItem?: IContextMenu) {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onMenuEvent', event);
        if (event && event.item && menuItem && typeof menuItem['click'] === 'function') {
            menuItem['click']['apply'](this, [ event.item ]);
        }
    }

    // -------------------------------------------------
    // ACTIONS
    // -------------------------------------------------

    /**
     * Put the specified Row index into editing mode
     * @param rowIndex to edit
     */
    public editRowByIndex(rowIndex: number) {
        this.editRow(this.getRowByIndex(rowIndex));
    }

    /**
     * Put the Row that contains the specified data (incl. data's attribute) into editing mode
     * @param item to edit
     * @param attr to detect Row
     */
    public editRowByData(item: any, attr?: string) {
        this.editRow(this.getRowByData(item, attr));
    }

    /**
     * Put the specified Row into editing mode
     * @param row to edit
     */
    public editRow(row: Row) {
        if (this.isRowInEditMode(row)) {
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
        if (!row || row.isInEditing || !row.cells || !row.cells.length
            || columnIndex >= row.cells.length) {
            return;
        }

        let cell: Cell;
        cell = (columnIndex < 0 ? undefined : row.cells[columnIndex]);
        this.getEditingRows().push(row);
        this.selectRow(row);
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
        row && this.removeEditingRow(row);
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
        row && this.removeEditingRow(row);
        row && this.getGridComponent().delete(row,
            this.getSmartTableComponent().deleteConfirm || new EventEmitter<any>());
        !row && this.getLogger().warn('Undefined row to delete');
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
        // not new row if editing
        if (this.isInEditMode()) {
            return;
        }

        // create new row
        let newRow: Row;
        newRow = this.getGridComponent().getNewRow();
        newRow.index = 0;

        // insert new row data into data source
        this.getGridComponent().create(newRow,
            this.getSmartTableComponent().createConfirm || new EventEmitter<any>());

        // wait for editing this row
        setTimeout(() => {
            newRow.isInEditing = false;
            this.editRow(newRow);
        }, 100);
    }

    /**
     * Put the specified Row index out of editing mode
     * @param rowIndex to cancel editing
     */
    protected cancelEditRowByIndex(rowIndex: number) {
        this.cancelEditRow(this.getRowByIndex(rowIndex), true);
    }

    /**
     * Put the Row that contains the specified data (incl. data's attribute) out of editing mode
     * @param item to cancel editing
     * @param attr to detect Row
     */
    protected cancelEditRowByData(item: any, attr?: string) {
        this.cancelEditRow(this.getRowByData(item, attr), true);
    }

    /**
     * Put the specified Row out of editing mode
     * @param row to cancel editing
     * @param refresh specify whether need to refresh data source
     */
    protected cancelEditRow(row: Row, refresh?: boolean) {
        !row && this.getLogger().warn('Undefined row to cancel');
        row && this.removeEditingRow(row);
        if (row && !row.isInEditing) {
            return;

        } else if (row) {
            row.isInEditing = false;
            row.isSelected = false;
        }
        // refresh for reset editors' data
        if (refresh) {
            this.getGridComponent().source.refresh();
        }
    }

    /**
     * Put the specified rows out of editing mode
     * @param rows to cancel editing
     */
    protected cancelEditRows(rows: Array<Row>) {
        if (rows && rows.length) {
            rows.forEach((r) => this.cancelEditRow(r, false));
            // refresh for reset editors' data
            this.getGridComponent().source.refresh();
        }
    }

    /**
     * Cancel all editing rows
     */
    protected cancelEditAll() {
        this.cancelEditRows(this.getRows());
    }

    // -------------------------------------------------
    // HELPER
    // -------------------------------------------------

    /**
     * Prevent the specified event
     * @param event to prevent
     */
    protected preventEvent(event: Event): boolean {
        if (!event) {
            return true;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.cancelBubble = true;
        event.returnValue = false;
        this.getLogger().debug('Prevent event', event);
        return false;
    }

    /**
     * Select the specified Row
     * @param row to select
     */
    public selectRow(row: Row) {
        if (row && !row.isSelected) {
            row.isSelected = true;
            this.getGridComponent().selectRow(row);
            this.getLogger().debug('Row is selected?', row.isSelected);

        } else if (!row) {
            this.getLogger().warn('Undefined row to select!');
        }
    }

    /**
     * Select the specified Row index
     * @param rowIndex to select
     */
    public selectRowByIndex(rowIndex: number) {
        this.selectRow(this.getRowByIndex(rowIndex));
    }

    /**
     * Select the specified Row data and attribute
     * @param item to detect Row
     * @param attr data attribute to detect Row
     */
    public selectRowByData(item: any, attr?: string) {
        this.selectRow(this.getRowByData(item, attr));
    }

    /**
     * Select the specified Row array
     * @param rows to select
     */
    public selectRows(rows: Array<Row>) {
        if (rows && rows.length) {
            rows.forEach(r => this.selectRow(r));
        } else {
            this.getLogger().warn('Undefined rows array to select!');
        }
    }

    /**
     * Un-Select the specified Row
     * @param row to unselect
     */
    public unSelectRow(row: Row) {
        if (row && row.isSelected) {
            row.isSelected = false;
            this.getLogger().debug('Row is selected?', row.isSelected);

        } else if (!row) {
            this.getLogger().warn('Undefined row to unselect!');
        }
    }

    /**
     * Un-Select the specified Row index
     * @param rowIndex to unselect
     */
    public unSelectRowByIndex(rowIndex: number) {
        this.unSelectRow(this.getRowByIndex(rowIndex));
    }

    /**
     * Un-Select the specified Row data and attribute
     * @param item to detect Row
     * @param attr data attribute to detect Row
     */
    public unSelectRowByData(item: any, attr?: string) {
        this.unSelectRow(this.getRowByData(item, attr));
    }

    /**
     * Toggle the specified Row class
     * @param item data to detect Row
     * @param attr data attribute to detect Row
     * @param className to add/remove
     */
    public toggleRowClassByData(item: any, className: string, attr?: string) {
        this.toggleRowClass(this.getRowByData(item, attr), className);
    }

    /**
     * Toggle the specified Row class
     * @param rowIndex to toggle
     * @param className to add/remove
     */
    public toggleRowClassByIndex(rowIndex: number, className: string) {
        this.toggleRowClass(this.getRowByIndex(rowIndex), className);
    }

    /**
     * Toggle the specified Row class
     * @param row to toggle
     * @param className to add/remove
     */
    public toggleRowClass(row: Row, className: string) {
        if (!(className || '').length) {
            return;
        }

        let rowEl: HTMLTableRowElement;
        rowEl = this.getRowElement(row);
        if (!rowEl) {
            return;
        }

        this.toggleRowElementClass(rowEl, className,
            (rowEl.classList && !rowEl.classList.contains(className)));
    }

    /**
     * Toggle the specified Row class
     * @param item data to detect Row
     * @param attr data attribute to detect Row
     * @param className to add/remove
     * @param add true for adding class if not existed; false for removing if existed
     */
    public attachRowClassByData(item: any, className: string, attr?: string, add?: boolean | false) {
        this.attachRowClass(this.getRowByData(item, attr), className, add);
    }

    /**
     * Toggle the specified Row class
     * @param rowIndex to toggle
     * @param className to add/remove
     * @param add true for adding class if not existed; false for removing if existed
     */
    public attachRowClassByIndex(rowIndex: number, className: string, add?: boolean | false) {
        this.attachRowClass(this.getRowByIndex(rowIndex), className, add);
    }

    /**
     * Toggle the specified Row class
     * @param row to toggle
     * @param className to add/remove
     * @param add true for adding class if not existed; false for removing if existed
     */
    public attachRowClass(row: Row, className: string, add?: boolean | false) {
        if (!(className || '').length) {
            return;
        }

        let rowEl: HTMLTableRowElement;
        rowEl = this.getRowElement(row);
        if (!rowEl) {
            return;
        }

        if ((add && rowEl.classList.contains(className))
            || (!add && !rowEl.classList.contains(className))) {
            return;
        }

        this.toggleRowElementClass(rowEl, className, add);
    }

    /**
     * Toggle the specified class for the specified Row DOM element
     * @param rowEl to toggle
     * @param className class
     * @param add true for adding class if not existed; false for removing if existed
     */
    protected toggleRowElementClass(rowEl: HTMLTableRowElement, className: string, add?: boolean | false) {
        if (!add) {
            this.getRenderer().removeClass(rowEl, className);

        } else {
            this.getRenderer().addClass(rowEl, className);
        }
    }

    /**
     * Support for closing all context menu
     */
    public closeContextMenu() {
        const keyEvent = new KeyboardEvent('keydown', {key: 'Escape'});
        this.getContextMenuService().closeAllContextMenus({
            eventType: 'cancel',
            event: keyEvent,
        });
    }

    /**
     * Remove the specified Row out of the editing rows cache
     * @param row to remove
     */
    private removeEditingRow(row: Row) {
        if (!row) {
            return;
        }

        let rows: Array<Row>;
        rows = this.getEditingRows();
        if (!rows || !rows.length) {
            return;
        }

        let rowCacheIndex: number;
        rowCacheIndex = rows.indexOf(row);
        if (rowCacheIndex < 0) {
            for (let i: number = 0; i < rows.length; i++) {
                if (row.index === rows[i].index) {
                    rowCacheIndex = i;
                    break;
                }
            }
        }

        (rowCacheIndex >= 0) && rows.splice(rowCacheIndex, 1);
    }

    /**
     * Show/Hide context menu base on the specified Row
     * @param row to show/hide
     * @param event current event
     * @return true for showing context menu; else false
     */
    protected showHideContextMenuOnRow(row: Row, event?: Event): boolean {
        this.getLogger().debug('onContextMenu', row);
        if (row) {
            let mouseEvent: MouseEvent;
            mouseEvent = (event instanceof MouseEvent ? event as MouseEvent : undefined);
            let kbEvent: KeyboardEvent;
            kbEvent = (event instanceof KeyboardEvent ? event as KeyboardEvent : undefined);
            let rowEl: HTMLTableRowElement;
            rowEl = this.getRowElement(row);
            let target: Node;
            target = (event && event.target instanceof Node
                && rowEl.contains(event.target as Node) ? event.target : rowEl);
            this.getContextMenuService().show.next({
                // Optional - if unspecified, all context menu components will open
                contextMenu: this.contextMenuComponent,
                event: mouseEvent || kbEvent,
                item: row.getData(),
                anchorElement: target,
            });
            // wait for showing context menu and focus on it
            setTimeout(() => {
                let ctxMnuEls: NodeListOf<HTMLElement>;
                ctxMnuEls = this.getRowElementsBySelector(SmartTableComponent.CONTEXT_MENU_SELECTOR);
                if (ctxMnuEls && ctxMnuEls.length) {
                    ctxMnuEls[0].focus({ preventScroll: true });
                }
            }, 300);
            return true;

        } else {
            this.closeContextMenu();
        }
        return false;
    }
}

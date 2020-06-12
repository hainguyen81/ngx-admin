import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    Output,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {Cell} from 'ng2-smart-table';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {MouseEventGuard} from '../customization/mouse.event.guard';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {Ng2SmartTableComponent} from 'ng2-smart-table/ng2-smart-table.component';
import {Grid} from 'ng2-smart-table/lib/grid';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {isArray, isNullOrUndefined, isNumber} from 'util';
import KeyboardUtils from '../../../utils/keyboard.utils';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent, IEvent} from '../abstract.component';
import ComponentUtils from '../../../utils/component.utils';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {Column} from 'ng2-smart-table/lib/data-set/column';
import {AbstractCellEditorFormControlComponent} from './abstract.cell.editor.form.control.component';

/* default smart table settings */
export const DefaultTableSettings = {
    add: {
        addButtonContent: '<i class=\'nb-plus\'></i>',
        createButtonContent: '<i class=\'nb-checkmark\'></i>',
        cancelButtonContent: '<i class=\'nb-close\'></i>',
        confirmCreate: true,
    },
    edit: {
        editButtonContent: '<i class=\'nb-edit\'></i>',
        saveButtonContent: '<i class=\'nb-checkmark\'></i>',
        cancelButtonContent: '<i class=\'nb-close\'></i>',
        confirmSave: true,
    },
    delete: {
        deleteButtonContent: '<i class=\'nb-trash\'></i>',
        confirmDelete: true,
    },
    footer: {
        rows: 0,
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

/**
 * Abstract smart table base on {Ng2SmartTableComponent}
 */
export abstract class AbstractSmartTableComponent<T extends DataSource>
    extends AbstractComponent implements AfterViewInit {

    protected static SMART_TABLE_SELETOR: string = 'ng2-smart-table table';
    protected static SMART_TABLE_BODY_SELETOR: string =
        [AbstractSmartTableComponent.SMART_TABLE_SELETOR, 'tbody'].join(' ');
    protected static SMART_TABLE_ROW_SELETOR: string =
        [AbstractSmartTableComponent.SMART_TABLE_BODY_SELETOR, 'tr'].join(' ');
    protected static SMART_TABLE_CELLS_SELECTOR: string = 'ng2-smart-table-cell';
    protected static SMART_TABLE_CELLS_EDIT_MODE_SELECTOR: string = 'table-cell-edit-mode';
    protected static SEARCH_FIELD_SELECTOR: string = '[type=\'search\']';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(Ng2SmartTableComponent)
    private readonly querySmartTableComponent: QueryList<Ng2SmartTableComponent>;
    private smartTableComponent: Ng2SmartTableComponent;

    private _tableHeader: string;
    private _edittingRows: Array<Row> = [];
    private _allowMultiEdit: boolean = false;
    private _tableFooterRows: HTMLTableRowElement[];

    /**
     * Event to fire while creating table footer with {IEvent} data as: {HTMLTableRowElement} array
     */
    @Output() readonly footerCreation: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {HTMLTableRowElement} of table footer if using footer
     * @return {HTMLTableRowElement}
     */
    protected get tableFooterRows(): HTMLTableRowElement[] {
        return this._tableFooterRows;
    }

    get allowMultipleEdit(): boolean {
        return this._allowMultiEdit || false;
    }

    set allowMultipleEdit(allow: boolean) {
        let changed: boolean;
        changed = (this._allowMultiEdit !== allow);
        this._allowMultiEdit = allow || false;
        if (!allow && changed && this.editingRows.length > 1) {
            // exclude the latest editing row
            this.editingRows.pop();
            // cancel all editing rows
            this.cancelEditRows(this.editingRows);
        }
    }

    get config(): any {
        return super.config || DefaultTableSettings;
    }

    set config(_config: any) {
        super.config = _config;
        this.translateSettings();
    }

    get tableHeader(): string {
        return this._tableHeader;
    }

    set tableHeader(header: string) {
        this._tableHeader = header;
    }

    protected get tableComponent(): Ng2SmartTableComponent {
        return this.smartTableComponent;
    }

    protected get gridComponent(): Grid {
        return (!isNullOrUndefined(this.tableComponent)
            ? this.tableComponent.grid : undefined);
    }

    /**
     * Get the current editing Row array
     * @return the current editing Row array or empty
     */
    protected get editingRows(): Array<Row> {
        return this._edittingRows || [];
    }

    /**
     * Get the current editing Row DOM elements array
     * @return the current editing Row DOM elements array
     */
    protected get editingRowElements(): Array<HTMLTableRowElement> {
        const editRows: Array<Row> = this.editingRows;
        if (!(editRows || []).length) {
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
    get isInEditMode(): boolean {
        const editingRows: Array<Row> = this.editingRows;
        return ((editingRows || []).length > 0);
    }

    /**
     * Get the selected rows
     * @return selected rows array
     */
    get selectedRows(): Array<Row> {
        return (this.gridComponent ? this.gridComponent.getSelectedRows() : []);
    }

    /**
     * Get the rows
     * @return rows array
     */
    get rows(): Array<Row> {
        return (this.gridComponent ? this.gridComponent.getRows() : []);
    }

    /**
     * Get the columns
     * @return columns array
     */
    get columns(): Array<Column> {
        return (this.gridComponent ? this.gridComponent.getColumns() : []);
    }

    /**
     * Get the first {Row}
     * @return the first {Row}
     */
    get firstRow(): Row {
        return (this.gridComponent ? this.gridComponent.getFirstRow() : undefined);
    }

    /**
     * Get the last {Row}
     * @return the last {Row}
     */
    get lastRow(): Row {
        return (this.gridComponent ? this.gridComponent.getLastRow() : undefined);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SmartTableComponent} class
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
    protected constructor(@Inject(DataSource) dataSource: T,
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

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.smartTableComponent) {
            this.smartTableComponent = ComponentUtils.queryComponent(
                this.querySmartTableComponent,
                    component => component && this.__detectForTableFooter());
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the specified Row whether is in EDIT mode
     * @return true for being in EDIT mode; else false
     */
    public isRowInEditMode(row: Row): boolean {
        return (!isNullOrUndefined(row) && row.isInEditing);
    }

    /**
     * Get the Row instance by the specified Row index
     * @param rowIdx to parse
     * @return Row or undefined
     */
    public getRowByIndex(rowIdx: number): Row {
        const rows: Array<Row> = this.rows;
        if ((rows || []).length && 0 <= rowIdx && rowIdx < rows.length) {
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
        const row: Row = this.getRowByIndex(rowIdx);
        return (!isNullOrUndefined(row) ? row.getData() : undefined);
    }

    /**
     * Get the Row index by the specified Row data
     * @param item Row data
     * @param attr attribute to compare
     * @return Row index or -1
     */
    public getRowIndexByData(item: any, attr?: string): number {
        const rows: Array<Row> = this.rows;
        if (!item || !(rows || []).length || (attr && attr.length && !item[attr])) {
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
        const rowIndex: number = this.getRowIndexByData(item, attr);
        if (rowIndex < 0) {
            return undefined;
        }

        const rows: Array<Row> = this.rows;
        return ((rows || []).length && rowIndex < rows.length ? rows[rowIndex] : undefined);
    }

    /**
     * Get the Row instance by the specified DOM event
     * @param event DOM event
     * @return Row or undefined
     */
    protected getRowByEvent(event: Event): Row {
        let rowIdx: number = -1;
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
        return this.getElementsBySelector(selector) as NodeListOf<HTMLTableRowElement>;
    }

    /**
     * Get the all Row DOM elements
     * @return Row DOM elements or undefined
     */
    protected getAllRowElements(): NodeListOf<HTMLTableRowElement> {
        return this.getRowElementsBySelector(AbstractSmartTableComponent.SMART_TABLE_ROW_SELETOR);
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
        if (isNullOrUndefined(row)) {
            return;
        }

        const rows: NodeListOf<HTMLTableRowElement> = this.getAllRowElements();
        if (!(rows || []).length || row.index >= rows.length || !this.getRenderer()) {
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
        const row: Row = this.getRowByIndex(rowIndex);
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
        const row: Row = this.getRowByIndex(rowIndex);
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
            cells = this.getElementsBySelector(AbstractSmartTableComponent.SMART_TABLE_CELLS_EDIT_MODE_SELECTOR);
            let editors: NodeListOf<HTMLElement>;
            editors = this.getFocusableElements(cells[columnIndex]);
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
        cellEls = this.getElementsBySelector(
            AbstractSmartTableComponent.SMART_TABLE_CELLS_SELECTOR) as NodeListOf<HTMLTableCellElement>;
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
     * Perform action on data-source changed event
     * @param value {IEvent} that contains {$data} as changed value
     */
    onDataSourceChanged(value: IEvent) {
        // apply table tabIndex to focus and handle keyboard event
        let timer: number;
        timer = window.setTimeout(() => {
            let tableEls: NodeListOf<HTMLElement>;
            tableEls = this.getElementsBySelector(AbstractSmartTableComponent.SMART_TABLE_SELETOR);
            if (tableEls && tableEls.length) {
                tableEls.item(0).tabIndex = 1;
                this.getRenderer().setAttribute(tableEls.item(0), 'tabIndex', '1');
                tableEls.item(0).focus({preventScroll: true});
            }
            clearTimeout(timer);
        }, 100);
    }

    /**
     * Triggered once a row is selected (either clicked or selected automatically
     * (after page is changed, after some row is deleted, etc)).
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onRowSelect(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onRowSelect', event);
    }

    /**
     * Triggered only on a user click event.
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onUserRowSelect(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onUserRowSelect', event);
        if (MouseEventGuard.isDoubleClick()) {
            this.onDoubleClick(event);
        }
    }

    /**
     * Triggered only on a user double-click event from onUserRowSelect.
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onDoubleClick(event: IEvent): void {
        // TODO Waiting for implementing from children component
        if (event && event.event instanceof MouseEvent) {
            let cell: Cell;
            cell = this.getCellByEvent(event.event);
            this.getLogger().debug('onDoubleClick', event, cell);
            if (cell && !this.isInEditMode) {
                this.editCell(cell);
            }
            this.preventEvent(event.event);

        } else if (event && event.data && event.data['data'] && !this.isInEditMode) {
            this.getLogger().debug('onDoubleClick', event);
            this.editRow(event.data['data']);
        }
    }

    /**
     * Triggered once a Create button clicked.
     * Triggered only if table mode = external.
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      source: DataSource - table data source
     */
    onCreate(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onCreate', event);
    }

    /**
     * Triggered once a Create button clicked.
     * Triggered only if table confirmCreate = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      newData: Object - data entered in a new row
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods.
     */
    onCreateConfirm(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onCreateConfirm', event);
    }

    /**
     * Triggered once an Edit button clicked on a row.
     * Triggered only if table mode = external.
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      data: Object - row data object
     *      source: DataSource - table data source
     */
    onEdit(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onEdit', event);
    }

    /**
     * Triggered once a Save button clicked.
     * Triggered only if table confirmSave = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      data: Object - original row data
     *      newData: Object - edited data
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods.
     */
    onEditConfirm(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onEditConfirm', event);
    }

    /**
     * Triggered once a Delete button clicked on a row.
     * Triggered only if table mode = external.
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      data: Object - row data object
     *      source: DataSource - table data source
     */
    onDelete(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDelete', event);
    }

    /**
     * Triggered once a Delete button clicked.
     * Triggered only if table confirmDelete = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      data: Object - data object to delete
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve() and reject() methods.
     */
    onDeleteConfirm(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onDeleteConfirm', event);
    }

    /**
     * Triggered click event
     * @param event {IEvent} that contains {$event} as MouseEvent
     */
    onClick(event: IEvent): void {
        // TODO Waiting for implementing from children component
        let row: Row;
        row = this.getRowByEvent(event.event as Event);
        this.getLogger().debug('onClick', event, row);
        if (row) {
            this.selectRow(row);

            // stop firing event
            this.preventEvent(event.event as Event);
        }
    }

    /**
     * Triggered ContextMenu.
     * @param event {IEvent} that contains {$event} as MouseEvent
     */
    onContextMenu(event: IEvent): void {
        // TODO Waiting for implementing from children component
        let row: Row;
        row = this.getRowByEvent(event.event as Event);
        this.getLogger().debug('onContextMenu', event, row);
        if (this.showHideContextMenuOnRow(row, event.event as Event)) {
            // stop firing event
            this.preventEvent(event.event as Event);
        }
    }

    /**
     * Perform search action
     * @param {IEvent} that contains {$event} as action event and {$data} as keyword to search
     */
    onSearch(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSearch', event);
        if (event && !(event.data || '').length) {
            this.getDataSource().setFilter(null, false);
            this.getDataSource().refresh();
            return;
        }

        this.doSearch(event.data);
    }

    /**
     * Perform search data by the specified keyword
     * @param keyword to filter
     */
    abstract doSearch(keyword: any): void;

    /**
     * Perform navigate keydown action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onNavigateKeyDown(event: IEvent): void {
        super.onNavigateKeyDown(event);

        let kbEvent: KeyboardEvent;
        kbEvent = event.event as KeyboardEvent;

        // check whether navigating on context menu
        let targetEl: HTMLElement;
        targetEl = (event && event.event as Event ? (<Event>event.event).target as HTMLElement : null);
        if (this.hasClosestElement(AbstractSmartTableComponent.SEARCH_FIELD_SELECTOR, targetEl)) {
            return;
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
            this.toggleElementClass(rows.item(0), 'hover', true);

        } else {
            // toggle hover class
            this.toggleElementClass(rows.item(hoveredRowIndex), 'hover', false);
            if (KeyboardUtils.isHomeKey(kbEvent) || KeyboardUtils.isPageUpKey(kbEvent)
                || (hoveredRowIndex + 1 >= rows.length && KeyboardUtils.isDownKey(kbEvent))) {
                hoveredRowIndex = 0;
                this.toggleElementClass(rows.item(hoveredRowIndex), 'hover', true);

            } else if (KeyboardUtils.isEndKey(kbEvent) || KeyboardUtils.isPageDownKey(kbEvent)
                || (hoveredRowIndex - 1 < 0 && KeyboardUtils.isUpKey(kbEvent))) {
                hoveredRowIndex = rows.length - 1;
                this.toggleElementClass(rows.item(hoveredRowIndex), 'hover', true);

            } else if (KeyboardUtils.isUpKey(kbEvent)) {
                hoveredRowIndex -= 1;
                this.toggleElementClass(rows.item(hoveredRowIndex), 'hover', true);

            } else if (KeyboardUtils.isDownKey(kbEvent)) {
                hoveredRowIndex += 1;
                this.toggleElementClass(rows.item(hoveredRowIndex), 'hover', true);
            }
        }
        this.preventEvent(event.event as Event);
    }

    /**
     * Perform context menu keydown action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onContextMenuKeyDown(event: IEvent): void {
        super.onContextMenuKeyDown(event);

        // check for showing context menu on currently hovered row
        const hoveredRowsSelector: string =
            [AbstractSmartTableComponent.SMART_TABLE_ROW_SELETOR, '.hover'].join('');
        let hoveredRows: NodeListOf<HTMLTableRowElement>;
        hoveredRows = this.getRowElementsBySelector(hoveredRowsSelector);
        let row: Row;
        row = (hoveredRows && hoveredRows.length
            ? this.getRowByElement(hoveredRows.item(0)) : undefined);
        if (this.showHideContextMenuOnRow(row, event.event as Event)) {
            // stop firing event
            this.preventEvent(event.event as Event);
        }
    }

    /**
     * Triggered `languageChange` event
     * @param event {IEvent} that contains {$event} as LangChangeEvent
     */
    onLangChange(event: IEvent): void {
        super.onLangChange(event);

        // apply translate
        this.translateSettings();
    }

    /**
     * Perform keydown action
     * @param event KeyboardEvent
     */
    onKeyDown(event: IEvent): void {
        if (event && event.event
            && (event.event.target as Element)
            && this.hasClosestElement(
                AbstractSmartTableComponent.SMART_TABLE_SELETOR, event.event.target as Element)) {
            super.onKeyDown(event);
        }
    }

    /**
     * Perform keyup action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onKeyUp(event: IEvent): void {
        if (event && event.event
            && (event.event.target as Element)
            && this.hasClosestElement(
                AbstractSmartTableComponent.SMART_TABLE_SELETOR, event.event.target as Element)) {
            super.onKeyUp(event);
        }
    }

    /**
     * Perform keypress action
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onKeyPress(event: IEvent): void {
        if (event && event.event
            && (event.event.target as Element)
            && this.hasClosestElement(
                AbstractSmartTableComponent.SMART_TABLE_SELETOR, event.event.target as Element)) {
            super.onKeyPress(event);
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
        this.editingRows.push(row);
        this.selectRow(row);
        this.gridComponent.edit(row);

        // wait for showing editor
        let timer: number;
        timer = window.setTimeout(() => {
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
            clearTimeout(timer);
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
        if (!row || !row.isInEditing) {
            return;
        }

        if (this.validateRow(row)) {
            this.removeEditingRow(row);
            this.gridComponent.save(row, this.tableComponent.editConfirm || new EventEmitter<any>());
        }
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
        return this.saveRows(this.selectedRows);
    }

    /**
     * Save the editing Row array in all rows
     */
    protected saveAllRows() {
        return this.saveRows(this.rows);
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
        row && this.gridComponent.delete(row,
            this.tableComponent.deleteConfirm || new EventEmitter<any>());
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
        return this.deleteRows(this.selectedRows);
    }

    /**
     * Delete all rows
     */
    protected deleteAllRows() {
        return this.deleteRows(this.rows);
    }

    /**
     * Create new Row
     */
    protected newRow() {
        // not new row if editing
        if (this.isInEditMode) {
            return;
        }

        // create new row
        let newRow: Row;
        newRow = this.gridComponent.getNewRow();
        newRow.index = 0;

        // insert new row data into data source
        this.gridComponent.create(newRow,
            this.tableComponent.createConfirm || new EventEmitter<any>());

        // wait for editing this row
        let timer: number;
        timer = window.setTimeout(() => {
            newRow.isInEditing = false;
            this.editRow(newRow);
            clearTimeout(timer);
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
            this.gridComponent.source.refresh();
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
            this.gridComponent.source.refresh();
        }
    }

    /**
     * Cancel all editing rows
     */
    protected cancelEditAll() {
        this.cancelEditRows(this.rows);
    }

    // -------------------------------------------------
    // HELPER
    // -------------------------------------------------

    /**
     * Select the specified Row
     * @param row to select
     */
    public selectRow(row: Row) {
        if (row && !row.isSelected) {
            row.isSelected = true;
            this.gridComponent.selectRow(row);
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

        this.toggleElementClass(rowEl, className,
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

        this.toggleElementClass(rowEl, className, add);
    }

    /**
     * Remove the specified Row out of the editing rows cache
     * @param row to remove
     */
    private removeEditingRow(row: Row) {
        if (!row) {
            return;
        }

        const rows: Array<Row> = this.editingRows;
        if (!(rows || []).length) {
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
        this.getLogger().debug('showHideContextMenuOnRow', row);
        let rowEl: HTMLTableRowElement;
        rowEl = (row ? this.getRowElement(row) : undefined);
        let target: Node;
        target = (event && event.target instanceof Node && rowEl && rowEl.contains(event.target as Node)
            ? event.target : !event || !event.target ? rowEl
                : this.getClosestElementBySelector(
                    AbstractSmartTableComponent.SMART_TABLE_ROW_SELETOR, event.target as Element));
        if (target) {
            return this.showHideContextMenu(event, target, (row ? row.getData() : undefined));
        }
        this.closeContextMenu();
        return true;
    }

    /**
     * Translate table settings
     */
    protected translateSettings(): void {
        // apply translate
        const settings: any = this.config;
        if (settings && Object.keys(settings).length) {
            if (!settings.hasOwnProperty('noDataMessage:key')) {
                settings['noDataMessage:key'] = settings['noDataMessage'];
            }
            settings['noDataMessage'] =
                this.translate(settings['noDataMessage:key'] || '');
            if (settings.hasOwnProperty('columns')) {
                Object.values(settings['columns']).forEach(column => {
                    if (column) {
                        if (!column.hasOwnProperty('title:key')) {
                            column['title:key'] = column['title'];
                        }
                        column['title'] = this.translate(column['title:key' || '']);
                        if (column['editor'] && column['editor']['config']
                            && isArray(column['editor']['config']['list'])) {
                            Array.from(column['editor']['config']['list']).forEach(item => {
                                if (!item.hasOwnProperty('title:key')) {
                                    item['title:key'] = column['title'];
                                }
                                item['title'] = this.translate(item['title:key' || '']);
                            });
                        }
                    }
                });
            }
        }
    }

    /**
     * Detect settings for table footer
     */
    private __detectForTableFooter(): void {
        const settings: any = this.config;
        const footerSettings: any = (!isNullOrUndefined(settings)
            && settings.hasOwnProperty('footer') ? settings['footer'] : undefined);
        const rowsNumber: number = (!isNullOrUndefined(footerSettings)
            && footerSettings.hasOwnProperty('rows') && isNumber(footerSettings['rows'])
            ? parseInt(footerSettings['rows'], 10) : 0);
        if (rowsNumber > 0) {
            const innerTable: HTMLTableElement = this.getFirstElementBySelector(
                AbstractSmartTableComponent.SMART_TABLE_SELETOR,
                this.getElementRef().nativeElement) as HTMLTableElement;
            // check to delete footer and create new while changing table settings
            if (!isNullOrUndefined(innerTable)) {
                innerTable.deleteTFoot();
            }

            // create new settings
            const innerFooter: HTMLTableSectionElement =
                (!isNullOrUndefined(innerTable)  ? innerTable.createTFoot() : undefined);
            if (!isNullOrUndefined(innerFooter)) {
                this._tableFooterRows = [];
                for (let i: number = 0; i < rowsNumber; i++) {
                    this._tableFooterRows.push(innerFooter.insertRow(i));
                }
                this._tableFooterRows.length
                && this.footerCreation.emit({ data: this._tableFooterRows });
            }
        }
    }

    /**
     * Validate the specified {Row}
     * @param row to validate
     * @return true for valid; else false
     */
    validateRow(row: Row): boolean {
        if (isNullOrUndefined(row)) {
            return true;
        }

        let invalid: boolean = false;
        (row.cells || []).forEach((cell: Cell) => {
            let cellValid: boolean;
            if (row.isInEditing && cell.isEditable()) {
                const componentRef: AbstractCellEditorFormControlComponent =
                    <AbstractCellEditorFormControlComponent>cell['componentRef'];
                cellValid = (!isNullOrUndefined(componentRef) && componentRef.validate(!componentRef.viewMode));

            } else {
                const validateFn: any = this.getConfigValue('validate');
                if (typeof validateFn === 'function') {
                    cellValid = (validateFn as Function).apply(
                        this, [cell, row, row.getData(), row.getNewData(), this.config]) as boolean;
                } else {
                    cellValid = true; // already validated before saving from/going out of the editing mode
                }
            }
            invalid = invalid || !cellValid;
            !cellValid && this.getLogger().warn('Invalid cell', cell);
        });
        return !invalid;
    }

    /**
     * Validate all {Row} in table
     * @return true for valid; else false
     */
    validate(): boolean {
        let invalid: boolean = false;
        (this.rows || []).forEach(
            row => invalid = invalid || !this.validateRow(row));
        return !invalid;
    }
}

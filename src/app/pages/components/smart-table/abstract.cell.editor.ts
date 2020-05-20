import {Cell, DefaultEditor} from 'ng2-smart-table';
import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef, EventEmitter,
    forwardRef,
    Inject,
    OnDestroy, Output,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {isObservable, Observable, of, throwError} from 'rxjs';
import {IEvent} from '../abstract.component';
import {Column} from 'ng2-smart-table/lib/data-set/column';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {isNullOrUndefined} from 'util';
import PromiseUtils from '../../../utils/promise.utils';
import {isPromise} from 'rxjs/internal-compatibility';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';

/**
 * Customization smart table cell editor/render component
 */
export abstract class AbstractCellEditor extends DefaultEditor
    implements OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _cell: Cell;

    private _valueFormatter: (value: any) => any;
    private _valueParser: (value: any) => any;
    @Output() readonly cellChanged: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating cell whether is in view-mode or edit-mode
     * @return true for view mode; else false
     */
    get viewMode(): boolean {
        return !this.isEditable || !this.isInEditingMode;
    }

    /**
     * Get the method to format field value to show
     * @return the method to format field value to show
     */
    get valueFormatter(): (value: any) => any {
        let formatter: (value: any) => any = this._valueFormatter;
        if (isNullOrUndefined(formatter) || typeof formatter !== 'function') {
            formatter = this.getConfigValue('valueFormatter');
        }
        return formatter;
    }

    /**
     * Get the method to format field value to show
     * @return the method to format field value to show
     */
    set valueFormatter(_valueFormatter: (value: any) => any) {
        this._valueFormatter = _valueFormatter;
    }

    /**
     * Get the method to format field value to show
     * @return the method to format field value to show
     */
    get valueParser(): (value: any) => any {
        let parser: (value: any) => any = this._valueParser;
        if (isNullOrUndefined(parser) || typeof parser !== 'function') {
            parser = this.getConfigValue('valueParser');
        }
        return parser;
    }

    /**
     * Get the method to format value to field value
     * @return the method to format value to field value
     */
    set valueParser(_valueParser: (value: any) => any) {
        this._valueParser = _valueParser;
    }

    /**
     * Get the configuration value of the specified configuration property key
     * @param propertyKey configuration key
     * @param defaultValue default value if not found or undefined
     */
    protected getConfigValue(propertyKey: string, defaultValue?: any | null): any {
        const _config: any = this.cellColumnConfig;
        const value: any = (_config || {})[propertyKey];
        return (isNullOrUndefined(value) ? defaultValue : value);
    }

    /**
     * Set the configuration value of the specified configuration property key
     * @param propertyKey configuration key
     * @param configValue configuration value
     */
    protected setConfigValue(propertyKey: string, configValue?: any | null): void {
        const _config: any = this.cellColumnConfig;
        if (!isNullOrUndefined(_config)) {
            _config[propertyKey] = configValue;
        }
    }

    /**
     * Get the current {Cell} value
     * @return the current {Cell} value
     */
    get cellValue(): any {
        return (this.cell ? this.cell.getValue() : undefined);
    }

    /**
     * Get a boolean value indicating the current {Cell} whether is editable
     * @return true for editable; else false
     */
    get isEditable(): boolean {
        return (this.cell ? this.cell.isEditable() : false);
    }

    /**
     * Get a boolean value indicating the current {Cell} whether is in edit mode
     * @return true for being in edit mode; else false
     */
    get isInEditingMode(): boolean {
        return (this.cellRow ? this.cellRow.isInEditing : false);
    }

    /**
     * Get the current {Cell} new value
     * @return the current {Cell} new value
     */
    get newCellValue(): any {
        return this.formatValue(this.cell ? this.cell.newValue : undefined);
    }

    /**
     * Set the current {Cell} new value
     * @param _value to apply
     */
    set newCellValue(_value: any) {
        if (this.cell && this.isEditable && this.isInEditingMode) {
            const newValue: any = this.parseValue(_value);
            if (this.cell.newValue !== newValue) {
                this.cell.newValue = newValue;
            }
        }
    }

    /**
     * Get the current {Column} instance
     * @return the current {Column} instance
     */
    get cellColumn(): Column {
        return (this.cell ? this.cell.getColumn() : undefined);
    }

    /**
     * Get the current {Row} instance
     * @return the current {Row} instance
     */
    get cellRow(): Row {
        return (this.cell ? this.cell.getRow() : undefined);
    }

    /**
     * Get the current {Row} data
     * @return the current {Row} data
     */
    get cellRowData(): any {
        return (this.cellRow ? this.cellRow.getData() : undefined);
    }

    /**
     * Get the current {Cell} identity
     * @return the current {Cell} identity
     */
    get cellId(): string {
        return (this.cell ? this.cell.getId() : undefined);
    }

    /**
     * Get the current {Column#getConfig} instance
     * @return the current {Column#getConfig} instance
     */
    get cellColumnConfig(): any {
        return (this.cellColumn ? this.cellColumn.getConfig() : undefined);
    }

    /**
     * Get the current {Cell} instance
     * @return the current {Cell} instance
     */
    get cell(): Cell {
        if (isNullOrUndefined(this._cell)) {
            if (super.cell) {
                this._cell = super.cell;
            } else if (this.parentCell) {
                this._cell = this.parentCell.cell;
            }
        }
        return this._cell;
    }

    /**
     * Set the current {Cell} instance
     * @param _cell to apply
     */
    set cell(_cell: Cell) {
        this._cell = _cell;
    }

    /**
     * Get the parent {CellComponent} instance
     * @return the parent {CellComponent} instance
     */
    protected get parentCell(): CellComponent {
        return this._parentCell;
    }

    /**
     * Get the {TranslateService} instance for applying multilingual
     * @return the {TranslateService} instance
     */
    protected get translateService(): TranslateService {
        return this._translateService;
    }

    /**
     * Get the {Renderer2} instance for applying HTML element attributes
     * @return the {Renderer2} instance
     */
    protected get renderer(): Renderer2 {
        return this._renderer;
    }

    /**
     * Get the {Renderer2} instance for applying HTML element attributes
     * @return the {Renderer2} instance
     */
    protected get logger(): NGXLogger {
        return this._logger;
    }

    /**
     * Get the {ComponentFactoryResolver} instance
     * @return the {ComponentFactoryResolver} instance
     */
    protected get factoryResolver(): ComponentFactoryResolver {
        return this._factoryResolver;
    }

    /**
     * Get the {ViewContainerRef} instance
     * @return the {ViewContainerRef} instance
     */
    protected get viewContainerRef(): ViewContainerRef {
        return this._viewContainerRef;
    }

    /**
     * Get the {ChangeDetectorRef} instance
     * @return the {ChangeDetectorRef} instance
     */
    protected get changeDetectorRef(): ChangeDetectorRef {
        return this._changeDetectorRef;
    }

    /**
     * Get the {ElementRef} instance
     * @return the {ElementRef} instance
     */
    protected get elementRef(): ElementRef {
        return this._elementRef;
    }

    /**
     * Get the cell changed event listener from the configuration
     * @return the cell changed event listener from the configuration
     */
    protected cellChangedListener(): ((e: IEvent) => void) {
        return this.getConfigValue('cellChanged') as ((e: IEvent) => void);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractCellEditor} class
     * @param _parentCell {CellComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    protected constructor(@Inject(forwardRef(() => CellComponent)) private _parentCell: CellComponent,
                          @Inject(TranslateService) private _translateService: TranslateService,
                          @Inject(Renderer2) private _renderer: Renderer2,
                          @Inject(NGXLogger) private _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) private _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) private _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) private _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) private _elementRef: ElementRef) {
        super();
        _parentCell || throwError('Could not inject CellComponent');
        _translateService || throwError('Could not inject TranslateService');
        _renderer || throwError('Could not inject Renderer2');
        _logger || throwError('Could not inject NGXLogger');
        _translateService.onLangChange.subscribe(value => this.onLangChange({event: value}));
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Triggered `languageChange` event
     * @param event {IEvent} that contains {$event} as LangChangeEvent
     */
    onLangChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.logger.debug('onLangChange', event, '[', this.constructor.name, ']');
    }

    ngOnDestroy(): void {
        // this.changeDetectorRef.detach();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Translate the specified value
     * @param value to translate
     * @param interpolateParams message parameters
     * @return translated value or itself
     */
    public translate(value?: string, interpolateParams?: Object | null): string {
        if (!(value || '').length || !this.translateService) {
            return value;
        }
        return (interpolateParams
            ? this.translateService.instant(value, interpolateParams)
            : this.translateService.instant(value));
    }

    /**
     * Formatter function to format the model field value to viewed value
     * @param value model value to format
     */
    protected formatValue(value: any): any {
        const formatter: (value: any) => any = this.valueFormatter;
        return (isNullOrUndefined(formatter) || typeof formatter !== 'function'
            ? value : formatter.apply(this, [value]));
    }

    /**
     * Parser function to parse the specified field viewed value or data instance to the model value
     * @param value to parse
     */
    protected parseValue(value?: any): any {
        let retValue: any;
        retValue = value;
        const __valPrepareFunc: (value: any) => any = this.getConfigValue('valuePrepareFunction');
        const parser: (value: any) => any = this.valueParser;
        if ((isNullOrUndefined(parser) || typeof parser !== 'function')
            && !isNullOrUndefined(__valPrepareFunc) && typeof __valPrepareFunc === 'function') {
            retValue = __valPrepareFunc.apply(this, [retValue]);

        } else if (!isNullOrUndefined(parser) && typeof parser === 'function') {
            retValue = parser.apply(this, [retValue]);
        }
        return retValue;
    }

    /**
     * Create an observe of the property configuration
     * @param property to observe
     * @param observeValueIfInvalidProperty specify whether observing cell's value
     * if property is not found from configuration
     */
    protected observeConfigProperty(property: string,
                                    observeValueIfInvalidProperty?: boolean | true): Observable<any> {
        const cell: Cell = this.cell;
        const config: any = this.cellColumnConfig;
        const column: Column = this.cellColumn;
        const _observeValueIfInvalidProperty = (observeValueIfInvalidProperty || true);
        if (column && Object.keys(column).length && column.hasOwnProperty(property)) {
            if (typeof column[property] === 'function') {
                return of(column[property].call(undefined,
                    this, cell, this.cellRow, this.cellRowData, this.cellColumnConfig));

            } else if (isObservable(column[property])) {
                return <Observable<any>>column[property];

            } else if (isPromise(column[property])) {
                return PromiseUtils.promiseToObservable(<Promise<any>>column[property]);

            } else {
                return of(column[property]);
            }

        } else if (config && Object.keys(config).length
            && config.hasOwnProperty(property)) {
            if (typeof config[property] === 'function') {
                return of(config[property].call(undefined,
                    this, cell, this.cellRow, this.cellRowData, this.cellColumnConfig));

            } else if (isObservable(config[property])) {
                return <Observable<any>>config[property];

            } else if (isPromise(config[property])) {
                return PromiseUtils.promiseToObservable(<Promise<any>>config[property]);

            } else {
                return of(config[property]);
            }

        } else if (_observeValueIfInvalidProperty) {
            return of(this.cellValue);
        }
        return of(undefined);
    }

    /**
     * Detect changes
     */
    public detectChanges(): void {
        if (!(<any>this.changeDetectorRef).destroyed) {
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Fire `cellChanged` event
     * @param $event {IEvent} with data as object:
     *      - changedData: $event#data that has been changed (added/removed/modified)
     *      - cellData: {#newCellValue}
     *      - cell: {Cell}
     *      - rowData: {#cellRowData}
     *      - row: {Row}
     */
    protected fireCellChanged($event: IEvent): void {
        if (this.viewMode) return;

        // check column settings for change listener
        const firedEvent: IEvent = { data: {
                changedData: $event.data,
                cellData: this.newCellValue,
                cell: this.cell,
                rowData: this.cellRowData,
                row: this.cellRow,
            } };
        const cellChangedListener: ((e: IEvent) => void) = this.cellChangedListener();
        if (!isNullOrUndefined(cellChangedListener)) {
            cellChangedListener.apply(this, [firedEvent]);
        }
        this.cellChanged.emit(firedEvent);
    }
}

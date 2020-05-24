import {Cell} from 'ng2-smart-table';
import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef, EventEmitter,
    forwardRef,
    Inject,
    Output,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {isObservable, Observable, of} from 'rxjs';
import {IEvent} from '../abstract.component';
import {Column} from 'ng2-smart-table/lib/data-set/column';
import {isNullOrUndefined} from 'util';
import PromiseUtils from '../../../utils/promise.utils';
import {isPromise} from 'rxjs/internal-compatibility';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';
import {BaseCellEditorFormControlComponent} from './base.cell.editor.form.control.component';

/**
 * Customization smart table cell editor/render component
 */
export abstract class AbstractCellEditor extends BaseCellEditorFormControlComponent {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _valueFormatter: (value: any) => any;
    private _valueParser: (value: any) => any;
    @Output() readonly cellChanged: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

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
     * Get the current {Cell} new value
     * @return the current {Cell} new value
     */
    get newCellValue(): any {
        return this.formatValue(super.newCellValue);
    }

    /**
     * Set the current {Cell} new value
     * @param _value to apply
     */
    set newCellValue(_value: any) {
        if (this.cell && !this.viewMode) {
            window.console.error(['newCellValue set', this,
                'Parsed value', this.parseValue(_value), 'origin value', _value]);
            super.newCellValue = this.parseValue(_value);
        }
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
    protected constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                          @Inject(TranslateService) _translateService: TranslateService,
                          @Inject(Renderer2) _renderer: Renderer2,
                          @Inject(NGXLogger) _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) _elementRef: ElementRef) {
        super(_parentCell, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

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
        let retValue: any = value;
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

import {Cell, DefaultEditor} from 'ng2-smart-table';
import {Host, Inject, Renderer2} from '@angular/core';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import {IEvent} from '../abstract.component';
import {Column} from 'ng2-smart-table/lib/data-set/column';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {isNullOrUndefined} from 'util';

export abstract class AbstractCellEditor extends DefaultEditor {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _cell: Cell;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

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
     * Get the current {Cell} new value
     * @return the current {Cell} new value
     */
    get newCellValue(): any {
        return (this.cell ? this.cell.newValue : undefined);
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
            } else if (this.parentView) {
                this._cell = this.parentView.cell;
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
     * Get the parent {CustomViewComponent} instance
     * @return the parent {CustomViewComponent} instance
     */
    protected get parentView(): CustomViewComponent {
        return this._parentView;
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

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    protected constructor(@Host() private _parentView: CustomViewComponent,
                          @Inject(TranslateService) private _translateService: TranslateService,
                          @Inject(Renderer2) private _renderer: Renderer2,
                          @Inject(NGXLogger) private _logger: NGXLogger) {
        super();
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
}

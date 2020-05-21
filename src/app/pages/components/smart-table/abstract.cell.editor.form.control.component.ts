import {
    AbstractControl,
    AbstractControlOptions,
    AsyncValidatorFn,
    FormControl,
    ValidatorFn,
} from '@angular/forms';
import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    Output,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {throwError} from 'rxjs';
import {IEvent} from '../abstract.component';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';
import {DefaultEditor} from 'ng2-smart-table';
import {Cell} from 'ng2-smart-table/lib/data-set/cell';
import {isNullOrUndefined} from 'util';
import {Column} from 'ng2-smart-table/lib/data-set/column';
import {Row} from 'ng2-smart-table/lib/data-set/row';

/**
 * Abstract cell editor as form {FormControl}
 */
export abstract class AbstractCellEditorFormControlComponent extends FormControl implements DefaultEditor {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _errorMessages: string[];
    private _cell: Cell;
    private _inputClass: string;

    @Output() readonly onStopEditing: EventEmitter<any> = new EventEmitter<any>(true);
    @Output() onEdited: EventEmitter<any> = new EventEmitter<any>(true);
    @Output() onClick: EventEmitter<any> = new EventEmitter<any>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the present {FormControl} instance
     * @return the present {FormControl} instance
     */
    get control(): AbstractControl {
        return this;
    }

    /**
     * Get a boolean value indicating cell whether is in view-mode or edit-mode
     * @return true for view mode; else false
     */
    get viewMode(): boolean {
        return !this.isEditable || !this.isInEditingMode;
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
     * Get the {Cell} array of the present {Row}
     * @return the {Cell} array of the present {Row}
     */
    get cells(): Cell[] {
        return (this.cellRow ? this.cellRow.getCells() : []);
    }

    /**
     * Get the present validation error messages
     * @return the present validation error messages
     */
    protected get errorMessages(): string[] {
        return this._errorMessages;
    }

    /**
     * Set the present validation error messages
     * @param _errorMessages to apply
     */
    protected set errorMessages(_errorMessages: string[]) {
        this._errorMessages = _errorMessages;
    }

    /**
     * Get the validation messages
     * @return the validation messages
     */
    protected get validationMessages(): { [error: string]: string } {
        return this._validationMessages;
    }

    /**
     * Set the validation messages
     * @param _validationMessages to apply
     */
    protected set validationMessages(_validationMessages: { [error: string]: string }) {
        this._validationMessages = _validationMessages;
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
     * Get the parent {CellComponent} instance
     * @return the parent {CellComponent} instance
     */
    protected get parentCell(): CellComponent {
        return this._parentCell;
    }

    /**
     * Get the present {Cell} instance
     * @return the present {Cell} instance
     */
    get cell(): Cell {
        if (isNullOrUndefined(this._cell) && this.parentCell) {
            this._cell = this.parentCell.cell;
        }
        return this._cell;
    }

    /**
     * Set the present {Cell} instance
     * @param _cell to apply
     */
    set cell(_cell: Cell) {
        this._cell = _cell;
    }

    /**
     * Get the present {Cell} class
     * @return the present {Cell} class
     */
    @Input() get inputClass(): string {
        return this._inputClass;
    }

    /**
     * Set the present {Cell} class
     * @param _inputClass to apply
     */
    set inputClass(_inputClass: string) {
        this._inputClass = _inputClass;
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
     * @param _formState form state
     * @param _validator {ValidatorFn | ValidatorFn[] | AbstractControlOptions | null}
     * @param _asyncValidator {AsyncValidatorFn | AsyncValidatorFn[] | null}
     * @param _validationMessages validation messages {{ [error: string]: string } | null}
     */
    protected constructor(@Inject(forwardRef(() => CellComponent)) private _parentCell: CellComponent,
                          @Inject(TranslateService) private _translateService: TranslateService,
                          @Inject(Renderer2) private _renderer: Renderer2,
                          @Inject(NGXLogger) private _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) private _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) private _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) private _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) private _elementRef: ElementRef,
                          _formState?: any | null,
                          _validator?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                          _asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
                          private _validationMessages?: { [error: string]: string } | null) {
        super(_formState, _validator, _asyncValidator);
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
     * Detect changes
     */
    public detectChanges(): void {
        if (!(<any>this.changeDetectorRef).destroyed) {
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Validate cell editor
     * @param unmodified specify whether should validate unmodified/modified data
     * @return true for valid; else false
     */
    abstract validate(unmodified?: boolean | false): boolean;
}

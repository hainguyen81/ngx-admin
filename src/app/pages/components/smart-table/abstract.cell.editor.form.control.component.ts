import {
    AbstractControl,
    AbstractControlOptions,
    AsyncValidatorFn,
    ControlValueAccessor,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input, OnInit,
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
import {isArray, isNullOrUndefined, isObject} from 'util';
import {Column} from 'ng2-smart-table/lib/data-set/column';
import {Row} from 'ng2-smart-table/lib/data-set/row';

/**
 * Abstract cell editor as form {FormControl}
 */
export abstract class AbstractCellEditorFormControlComponent extends FormControl
    implements DefaultEditor, AfterViewInit, ControlValueAccessor, OnInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _formGroup: FormGroup = new FormGroup({});
    private _errorMessages: string[];
    private _cell: Cell;
    private _inputClass: string;

    @Output() readonly onStopEditing: EventEmitter<any> = new EventEmitter<any>(true);
    @Output() readonly onEdited: EventEmitter<any> = new EventEmitter<any>(true);
    @Output() readonly onClick: EventEmitter<any> = new EventEmitter<any>(true);

    private _onTouch: any[];
    private _onChange: any[];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the `formControl` directive
     * whether should apply value accessor as the present if undefined
     * @return true for should applying; else false
     */
    protected get shouldValueAccessorAsThis() {
        return true;
    }

    /**
     * Get the `onTouch` callback from {ControlValueAccessor#onTouch}
     * @return the `onTouch` callback from {ControlValueAccessor#onTouch}
     */
    @Input() get onTouch(): any[] {
        return this._onTouch || [];
    }

    /**
     * Set the `onTouch` callback from {ControlValueAccessor#onTouch}
     * @param _onTouch to apply
     */
    set onTouch(_onTouch: any[]) {
        this._onTouch = _onTouch || [];
    }

    /**
     * Get the `onChange` callback from {ControlValueAccessor#onChange}
     * @return the `onChange` callback from {ControlValueAccessor#onChange}
     */
    @Input() get onChange(): any[] {
        return this._onChange || [];
    }

    /**
     * Set the `onChange` callback from {ControlValueAccessor#onTouch}
     * @param _onChange to apply
     */
    set onChange(_onChange: any[]) {
        this._onChange = _onChange || [];
    }

    /**
     * Get the present {FormGroup} instance
     * @return the present {FormGroup} instance
     */
    @Input() get formGroup(): FormGroup {
        return this._formGroup;
    }

    /**
     * Set the present {FormGroup} instance
     * @param _formGroup to apply
     */
    set formGroup(_formGroup: FormGroup) {
        this._formGroup = _formGroup || new FormGroup({});
        this.cell && this._formGroup && !this._formGroup.contains(this.cellId)
        && this._formGroup.registerControl(this.cellId, this);
    }

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
     * Get the current {Cell} value
     * @return the current {Cell} value
     */
    get cellValue(): any {
        return (this.cell ? this.cell.getValue() : undefined);
    }

    /**
     * Get the current {Cell} new value
     * @return the current {Cell} new value
     */
    get newCellValue(): any {
        return (this.viewMode ? this.cell.getValue() : this.cell.newValue);
    }

    /**
     * Set the current {Cell} new value
     * @param _value to apply
     */
    set newCellValue(_value: any) {
        if (this.cell && !this.viewMode && this.cell.newValue !== _value) {
            this.cell.newValue = _value;
        }
    }

    /**
     * Get the current {Column#getConfig} instance
     * @return the current {Column#getConfig} instance
     */
    get cellColumnConfig(): any {
        return (isNullOrUndefined(this.cellColumn)
            ? {} : (this.cellColumn.getConfig() || this.cellColumn['config'] || {}));
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
     * Get a boolean value indicating the cell whether is disabled in edit mode
     * @return true for disabled; else false
     */
    get disabled(): boolean {
        if (this.viewMode) return true;
        const disabledConfig: any = this.getConfigValue('disabled', false);
        if (isNullOrUndefined(disabledConfig)) return false;
        if (typeof disabledConfig === 'function') {
            return (disabledConfig as Function).apply(this,
                [this.cell, this.cellRow, this.cellRowData, this.cellColumnConfig]) as boolean;
        }
        return (disabledConfig === true);
    }

    /**
     * Get a boolean value indicating the cell whether is required in edit mode
     * @return true for required; else false
     */
    get required(): boolean {
        if (this.viewMode) return true;
        const requiredConfig: any = this.getConfigValue('required', false);
        if (isNullOrUndefined(requiredConfig)) return false;
        if (typeof requiredConfig === 'function') {
            return (requiredConfig as Function).apply(this,
                [this.cell, this.cellRow, this.cellRowData, this.cellColumnConfig]) as boolean;
        }
        return (requiredConfig === true);
    }

    /**
     * Get a boolean value indicating the cell whether is readonly in edit mode
     * @return true for readonly; else false
     */
    get readonly(): boolean {
        if (this.viewMode) return true;
        const readonlyConfig: any = this.getConfigValue('readonly', false);
        if (isNullOrUndefined(readonlyConfig)) return false;
        if (typeof readonlyConfig === 'function') {
            return (readonlyConfig as Function).apply(this,
                [this.cell, this.cellRow, this.cellRowData, this.cellColumnConfig]) as boolean;
        }
        return (readonlyConfig === true);
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
                          private _formState?: any | null,
                          private _validator?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                          private _asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
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

    ngOnInit(): void {
        if (this.cell && isNullOrUndefined(this.cell['componentRef'])) {
            this.cell['componentRef'] = this;
        }
    }

    /**
     * Triggered `languageChange` event
     * @param event {IEvent} that contains {$event} as LangChangeEvent
     */
    onLangChange(event: IEvent): void {
        // TODO Waiting for implementing from children component
        // this.logger.debug('onLangChange', event, '[', this.constructor.name, ']');
    }

    ngAfterViewInit() {
        // check config for validation
        this.__detectValidationConfig();

        // register form control for cell
        this.cell && this.formGroup && !this.formGroup.contains(this.cellId)
        && this.formGroup.registerControl(this.cellId, this.control);
    }

    registerOnTouched(fn: any) {
        // this.logger.debug('registerOnTouched', fn);
        if (this.viewMode) return;
        const _onTouches: any[] = this.onTouch;
        _onTouches.push(fn);
        this.onTouch = _onTouches;
    }

    registerOnChange(fn: Function) {
        // this.logger.debug('registerOnChange', fn);
        if (this.viewMode) return;
        const _onChanges: any[] = this.onChange;
        _onChanges.push(fn);
        this.onChange = _onChanges;
    }

    writeValue(obj: any) {
        // this.logger.debug('writeValue', obj);
        if (this.viewMode) return;
    }

    setDisabledState(isDisabled: boolean): void {
        // this.logger.debug('setDisabledState', isDisabled);
        this.setConfigValue('disabled', isDisabled);
        this.setConfigValue('readonly', isDisabled);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Detect the validation in configuration
     * @private
     */
    private __detectValidationConfig(): void {
        const configValidators: any = this.getConfigValue('validators');
        const parsedValidators: ValidatorFn[] = this.__parseValidatorFunctions(configValidators);
        const presentValidators: ValidatorFn[] = this.__parseValidatorFunctions(this._validator);
        const configAsyncValidators: any = this.getConfigValue('asyncValidators');
        const parsedAsyncValidators: AsyncValidatorFn[] = this.__parseAsyncValidatorFunctions(configAsyncValidators);
        const presentAsyncValidators: AsyncValidatorFn[] = this.__parseAsyncValidatorFunctions(this._asyncValidator);
        this.setValidators((require ? [Validators.required] : []).concat(presentValidators).concat(parsedValidators));
        this.setAsyncValidators([].concat(presentAsyncValidators).concat(parsedAsyncValidators));
    }

    /**
     * Parse the {ValidatorFn} from the specified value
     * @param validators to parse
     * @private
     */
    private __parseValidatorFunctions(validators: any): ValidatorFn[] {
        if (isNullOrUndefined(validators)) {
            return [];

        } else if (isArray(validators) && Array.from(validators as ValidatorFn[]).length) {
            return [].concat(Array.from(validators as ValidatorFn[]));

        } else if (isObject(validators)) {
            if (validators.hasOwnProperty('validators')) {
                return [].concat(this.__parseValidatorFunctions(validators['validators']));

            } else if (validators.hasOwnProperty('validation')) {
                return [].concat(this.__parseValidatorFunctions(validators['validation']));

            } else {
                let validatorFn: ValidatorFn[] = [];
                Object.keys(validators).forEach(key => {
                    validatorFn = validatorFn.concat(this.__parseValidatorFunctions(validators[key]));
                });
                return validatorFn;
            }

        } else if (typeof validators === 'function' && !isNullOrUndefined(<ValidatorFn>validators)) {
            return [validators];
        }
        return [];
    }

    /**
     * Parse the {AsyncValidatorFn} from the specified value
     * @param validators to parse
     * @private
     */
    private __parseAsyncValidatorFunctions(validators: any): AsyncValidatorFn[] {
        if (isNullOrUndefined(validators)) {
            return [];

        } else if (isArray(validators) && Array.from(validators as AsyncValidatorFn[]).length) {
            return [].concat(Array.from(validators as AsyncValidatorFn[]));

        } else if (isObject(validators)) {
            if (validators.hasOwnProperty('asyncValidators')) {
                return [].concat(this.__parseAsyncValidatorFunctions(validators['asyncValidators']));

            } else if (validators.hasOwnProperty('validation')) {
                return [].concat(this.__parseAsyncValidatorFunctions(validators['validation']));

            } else {
                let validatorFn: AsyncValidatorFn[] = [];
                Object.keys(validators).forEach(key => {
                    validatorFn = validatorFn.concat(this.__parseAsyncValidatorFunctions(validators[key]));
                });
                return validatorFn;
            }

        } else if (typeof validators === 'function' && !isNullOrUndefined(<ValidatorFn>validators)) {
            return [validators];
        }
        return [];
    }

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

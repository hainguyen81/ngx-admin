import {
    AbstractControlOptions,
    AsyncValidatorFn,
    ValidatorFn,
} from '@angular/forms';
import {
    AbstractCellEditorFormControlComponent,
} from './abstract.cell.editor.form.control.component';
import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Base cell editor as form {FormControl}
 */
export class BaseCellEditorFormControlComponent extends AbstractCellEditorFormControlComponent {

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
    protected constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                          @Inject(TranslateService) _translateService: TranslateService,
                          @Inject(Renderer2) _renderer: Renderer2,
                          @Inject(NGXLogger) _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) _elementRef: ElementRef,
                          _formState?: any | null,
                          _validator?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                          _asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
                          _validationMessages?: { [error: string]: string } | null) {
        super(_parentCell, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef,
            _formState, _validator, _asyncValidator, _validationMessages);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Validate cell editor
     * @param unmodified specify whether should validate unmodified/modified data
     * @return true for valid; else false
     */
    validate(unmodified?: boolean): boolean {
        const errorMessages: string[] = [];
        if ((this.dirty || unmodified) && this.invalid) {
            const validationMessages: { [error: string]: string } = this.validationMessages || {};
            Object.keys(this.errors || {}).forEach(key => {
                const _errorMessage: string = validationMessages[key] || '';
                _errorMessage.length && errorMessages.push(_errorMessage);
            });
            this.markAsTouched();
        }
        this.errorMessages = errorMessages;
        return !this.invalid;
    }
}

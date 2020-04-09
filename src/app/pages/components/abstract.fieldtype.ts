import {Inject, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {FieldType} from '@ngx-formly/material';
import {FormlyFieldConfig} from '@ngx-formly/core';

export abstract class AbstractFieldType<F extends FormlyFieldConfig = FormlyFieldConfig>
    extends FieldType<F> implements OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _field: F;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {FormlyFieldConfig} instance
     * @return the {FormlyFieldConfig} instance
     */
    get field(): F {
        return this._field;
    }

    /**
     * Set the {FormlyFieldConfig} instance
     * @param field to apply
     */
    set field(field: F) {
        this._field = field;
        if (this._field && this._field.templateOptions) {
            this._field.templateOptions['componentRef'] = this;
        }
    }

    /**
     * Get the {TranslateService} instance for applying multilingual
     * @return the {TranslateService} instance
     */
    protected get translateService(): TranslateService {
        return this._translateService;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractFieldType} class
     * @param translateService {TranslateService}
     */
    protected constructor(@Inject(TranslateService) private _translateService: TranslateService) {
        super();
        _translateService || throwError('Could not inject TranslateService');
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnDestroy(): void {
        if (this.field && this.field.templateOptions) {
            delete this._field.templateOptions['componentRef'];
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Translate the specified value
     * @param value to translate
     * @return translated value or itself
     */
    public translate(value?: string, interpolateParams?: Object | null): string {
        if (!(value || '').length || !this.translateService) {
            return value;
        }
        return (interpolateParams ? this.translateService.instant(value, interpolateParams)
            : this.translateService.instant(value));
    }

    /**
     * Formatter function to format the model field value to viewed value
     * @param value model value to format
     */
    protected valueFormatter(value: any): any {
        return value;
    }

    /**
     * Parser function to parse the specified field viewed value or data instance to the model value
     * @param value to parse
     */
    protected valueParser(value?: any): any {
        let retValue: any;
        retValue = value;
        if (this.field) {
            for (const parser of (this.field.parsers || [])) {
                retValue = parser.apply(this, [retValue]);
            }
        }
        return retValue;
    }
}

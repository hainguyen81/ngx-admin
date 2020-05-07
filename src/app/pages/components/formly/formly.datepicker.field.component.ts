import {Component, Inject, Renderer2} from '@angular/core';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {INgxDatePickerConfig} from '../datepicker/abstract.datepicker.component';
import {IDatePickerConfig} from 'ng2-date-picker';
import {isNullOrUndefined} from 'util';
import {Moment} from 'moment';
import * as moment from 'moment';

/**
 * Formly date-picker field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-date-picker-field',
    templateUrl: './formly.datepicker.field.component.html',
    styleUrls: ['./formly.datepicker.field.component.scss'],
})
export class DatePickerFormFieldComponent extends AbstractFieldType {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    set config(_config: any) {
        const __config: INgxDatePickerConfig = _config as INgxDatePickerConfig;
        const __dtConfig: IDatePickerConfig = (__config ? __config.config : undefined);
        if (!isNullOrUndefined(__dtConfig) && (__dtConfig.format || '').length) {
            __dtConfig.format = this.translate(__dtConfig.format);
        }
        super.config = __dtConfig;
    }

    /**
     * Get the date/time format pattern from configuration
     * @return the date/time format pattern from configuration
     */
    get dateTimePattern(): string {
        const __config: INgxDatePickerConfig = super.config as INgxDatePickerConfig;
        const __dtConfig: IDatePickerConfig = (__config ? __config.config : undefined);
        return  __dtConfig.format;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageGalleryFormFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_translateService, _renderer, _logger);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    protected valueFormatter(value: any): Moment {
        const momentValue: Moment = value as Moment;
        const dtValue: Date = value as Date;
        const numberValue: number = value as number;
        return (momentValue ? momentValue : dtValue
            ? moment(dtValue) : numberValue ? moment(numberValue)
                : value ? moment(value.toString(), this.dateTimePattern) : undefined);
    }

    protected valueParser(value?: any): string {
        const momentValue: Moment = value as Moment;
        const dtValue: Date = value as Date;
        const numberValue: number = value as number;
        return (momentValue ? momentValue.format(this.dateTimePattern)
                : dtValue ? moment(dtValue).format(this.dateTimePattern)
                    : numberValue ? moment(numberValue).format(this.dateTimePattern)
                        : value ? moment(value.toString()).format(this.dateTimePattern) : undefined);
    }
}

import {AfterViewInit, Component, Inject, OnInit, Renderer2} from '@angular/core';
import {DatePickerFormFieldComponent} from '../../../formly/formly.datepicker.field.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Moment} from 'moment';

/**
 * Formly Image field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-date-picker-field-app',
    templateUrl: '../../../formly/formly.datepicker.field.component.html',
    styleUrls: ['../../../formly/formly.datepicker.field.component.scss'],
})
export class AppFormlyDatePickerFieldComponent
    extends DatePickerFormFieldComponent
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    set value(_value: Moment) {
        super.value = this.valueParser(_value);
    }

    get value(): Moment {
        return this.valueFormatter(super.value);
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

    protected valueFormatter(value: any): any {
        return super.valueFormatter(value);
    }
}

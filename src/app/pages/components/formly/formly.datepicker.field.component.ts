import {Component, Inject, Renderer2} from '@angular/core';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Formly Image field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-date-picker-field',
    templateUrl: './formly.datepicker.field.component.html',
    styleUrls: ['./formly.datepicker.field.component.scss'],
})
export class DatePickerFormFieldComponent extends AbstractFieldType {

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
}

import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Formly Treeview Dropdown field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-password',
    templateUrl: './formly.password.field.component.html',
    styleUrls: ['./formly.password.field.component.scss'],
})
export class PasswordFormFieldComponent extends AbstractFieldType implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChild('passwordField', {static: false}) private passwordField;

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SelectExFormFieldComponent} class
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
    // FUNCTION
    // -------------------------------------------------

    private toggleShowHidePassword() {
        this.passwordField.nativeElement.type =
            (this.passwordField.nativeElement.type === 'password' ? 'text' : 'password');
    }
}

import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewChild, ViewContainerRef,} from '@angular/core';
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

    @ViewChild('passwordField', {static: false}) private passwordField: any;

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SelectExFormFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (this.field) {
            this.field.className = [(this.field.className || ''),
                'form-field form-password-field'].join(' ').trim();
        }
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    private toggleShowHidePassword() {
        this.passwordField.nativeElement.type =
            (this.passwordField.nativeElement.type === 'password' ? 'text' : 'password');
    }
}

import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
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
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageGalleryFormFieldComponent} class
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
}

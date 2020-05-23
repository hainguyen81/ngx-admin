import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    Output,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {IModel} from '../../../../../@core/data/base';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {SelectFormFieldComponent} from '../../../formly/formly.select.field.component';
import {INgxSelectOptions} from '../../../select/abstract.select.component';
import {IEvent} from '../../../abstract.component';
import {isNullOrUndefined} from 'util';

/**
 * Custom formly field for selecting parent
 */
@Component({
    selector: 'ngx-formly-select-app',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export abstract class AppFormlySelectFieldComponent<T extends IModel>
    extends SelectFormFieldComponent
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @Output() readonly onSelect: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() readonly onFocus: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() readonly onBlur: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     * @param _config {INgxSelectOptions}
     */
    protected constructor(@Inject(TranslateService) _translateService: TranslateService,
                          @Inject(Renderer2) _renderer: Renderer2,
                          @Inject(NGXLogger) _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) _elementRef: ElementRef,
                          _config?: INgxSelectOptions | null) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this.config = _config;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit() {
        super.ngAfterViewInit();

        if (!isNullOrUndefined(super.selectComponent)) {
            super.selectComponent.change.subscribe(($event: IEvent) => {
                this.onSelect.emit($event);
            });
            super.selectComponent.focus.subscribe(($event: IEvent) => {
                this.onFocus.emit($event);
            });
            super.selectComponent.blur.subscribe(($event: IEvent) => {
                this.onBlur.emit($event);
            });
        }
    }
}

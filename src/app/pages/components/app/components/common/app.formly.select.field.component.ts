import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    OnDestroy,
    Output,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {IModel} from '../../../../../@core/data/base';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {SelectFormFieldComponent} from '../../../formly/formly.select.field.component';
import {IEvent} from '../../../abstract.component';
import ObjectUtils from '../../../../../utils/common/object.utils';
import {Subscription} from 'rxjs';
import FunctionUtils from '../../../../../utils/common/function.utils';
import PromiseUtils from '../../../../../utils/common/promise.utils';

/**
 * Custom formly field for selecting parent
 */
@Component({
    selector: 'ngx-formly-select-app',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export class AppFormlySelectFieldComponent<T extends IModel>
    extends SelectFormFieldComponent
    implements AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @Output() readonly onSelect: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() readonly onFocus: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);
    @Output() readonly onBlur: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    private __changeSubscription: Subscription;
    private __focusSubscription: Subscription;
    private __blurSubscription: Subscription;

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

    ngAfterViewInit() {
        super.ngAfterViewInit();

        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__changeSubscription) && ObjectUtils.isNotNou(super.selectComponent),
            () => this.__changeSubscription = super.selectComponent.change.subscribe(($event: IEvent) => this.onSelect.emit($event)),
            this);
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__focusSubscription) && ObjectUtils.isNotNou(super.selectComponent),
            () => this.__focusSubscription = super.selectComponent.focus.subscribe(($event: IEvent) => this.onFocus.emit($event)),
            this);
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__blurSubscription) && ObjectUtils.isNotNou(super.selectComponent),
            () => this.__blurSubscription = super.selectComponent.blur.subscribe(($event: IEvent) => this.onBlur.emit($event)),
            this);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__changeSubscription);
        PromiseUtils.unsubscribe(this.__focusSubscription);
        PromiseUtils.unsubscribe(this.__blurSubscription);
    }
}

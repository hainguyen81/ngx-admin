import {Subscription} from 'rxjs';
import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, QueryList, Renderer2, ViewChildren, ViewContainerRef} from '@angular/core';
import {DataSource} from '@app/types/index';
import {AbstractSelectComponent, DefaultNgxSelectOptions} from './abstract.select.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {NgSelectComponent, NgSelectConfig} from '@ng-select/ng-select';
import ComponentUtils from '../../../utils/common/component.utils';
import FunctionUtils from '../../../utils/common/function.utils';
import ObjectUtils from '../../../utils/common/object.utils';
import PromiseUtils from '../../../utils/common/promise.utils';

/**
 * Select component base on {NgSelectComponent}
 */
@Component({
    selector: 'ngx-select-2',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [{
        provide: NgSelectConfig, useValue: DefaultNgxSelectOptions,
        multi: true,
    }],
})
export class NgxSelectComponent extends AbstractSelectComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgSelectComponent)
    private readonly queryNgSelectComponent: QueryList<NgSelectComponent>;
    private ngSelectComponent: NgSelectComponent;

    private __addEventSubscription: Subscription;
    private __blurEventSubscription: Subscription;
    private __changeEventSubscription: Subscription;
    private __closeEventSubscription: Subscription;
    private __clearEventSubscription: Subscription;
    private __focusEventSubscription: Subscription;
    private __searchEventSubscription: Subscription;
    private __openEventSubscription: Subscription;
    private __removeEventSubscription: Subscription;
    private __scrollEventSubscription: Subscription;
    private __scrollToEndEventSubscription: Subscription;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgSelectComponent} component
     * @return the {NgSelectComponent} component
     */
    protected get selectComponent(): NgSelectComponent {
        return this.ngSelectComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractSelectComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            DefaultNgxSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.ngSelectComponent) {
            const _this: NgxSelectComponent = this;
            this.ngSelectComponent = ComponentUtils.queryComponent(
                this.queryNgSelectComponent, component => {
                    if (ObjectUtils.isNotNou(component)) {
                        component[AbstractSelectComponent.NG_SELECT_PARENT_COMPONENT_REF_PROPERTY] = _this;
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__addEventSubscription),
                            () => this.__addEventSubscription = component.addEvent.subscribe((addedItem: any) => this.onAdd({ data: addedItem })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__blurEventSubscription),
                            () => this.__blurEventSubscription = component.blurEvent.subscribe(($event: any) => this.onBlur({ event: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__changeEventSubscription),
                            () => this.__changeEventSubscription = component.changeEvent.subscribe(($event: any) => this.onChange({ data: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__closeEventSubscription),
                            () => this.__closeEventSubscription = component.closeEvent.subscribe(($event: any) => this.onClose({ event: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__clearEventSubscription),
                            () => this.__clearEventSubscription = component.clearEvent.subscribe(($event: any) => this.onClear({ event: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__focusEventSubscription),
                            () => this.__focusEventSubscription = component.focusEvent.subscribe(($event: any) => this.onFocus({ event: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__searchEventSubscription),
                            () => this.__searchEventSubscription = component.searchEvent.subscribe(($event: any) => this.onSearch({ data: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__openEventSubscription),
                            () => this.__openEventSubscription = component.openEvent.subscribe(($event: any) => this.onOpen({ event: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__removeEventSubscription),
                            () => this.__removeEventSubscription = component.removeEvent.subscribe(($event: any) => this.onRemove({ data: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__scrollEventSubscription),
                            () => this.__scrollEventSubscription = component.scroll.subscribe(($event: any) => this.onScroll({ data: $event })),
                            _this);
                        FunctionUtils.invokeTrue(
                            ObjectUtils.isNou(_this.__scrollToEndEventSubscription),
                            () => this.__scrollToEndEventSubscription = component.scrollToEnd.subscribe(($event: any) => this.onScrollToEnd({ event: $event })),
                            _this);
                    }
                });
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__addEventSubscription);
        PromiseUtils.unsubscribe(this.__blurEventSubscription);
        PromiseUtils.unsubscribe(this.__changeEventSubscription);
        PromiseUtils.unsubscribe(this.__closeEventSubscription);
        PromiseUtils.unsubscribe(this.__clearEventSubscription);
        PromiseUtils.unsubscribe(this.__focusEventSubscription);
        PromiseUtils.unsubscribe(this.__searchEventSubscription);
        PromiseUtils.unsubscribe(this.__openEventSubscription);
        PromiseUtils.unsubscribe(this.__removeEventSubscription);
        PromiseUtils.unsubscribe(this.__scrollEventSubscription);
        PromiseUtils.unsubscribe(this.__scrollToEndEventSubscription);
    }
}

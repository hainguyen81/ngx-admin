import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    Output,
    QueryList,
    Renderer2,
    RendererStyleFlags2,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from '@app/types/index';
import {AbstractSelectExComponent} from './abstract.select.ex.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../abstract.component';
import {NgxSelectComponent, NgxSelectOption} from 'ngx-select-ex';
import {Subscription} from 'rxjs';
import {IToolbarActionsConfig} from '../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '../../../utils/common/object.utils';
import ComponentUtils from 'app/utils/common/component.utils';
import FunctionUtils from '../../../utils/common/function.utils';
import PromiseUtils from '../../../utils/common/promise.utils';
import AssertUtils from '@app/utils/common/assert.utils';

/**
 * Select component base on {NgxSelectComponent}
 */
@Component({
    selector: 'ngx-select-ex',
    templateUrl: './select.ex.component.html',
    styleUrls: ['./select.ex.component.scss'],
})
export class NgxSelectExComponent extends AbstractSelectExComponent<DataSource>
    implements AfterViewInit {

    protected static SELECT_ITEM_ELEMENT_CLASS_SELECTOR: string = '.ngx-select__item';
    protected static SELECT_ITEM_ELEMENT_LABEL_SELECTOR: string = '.ngx-select-option_option-label';
    protected static SELECT_ITEM_ELEMENT_LABEL_OPTION_DATA: string = 'option';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgxSelectComponent)
    private readonly queryNgxSelectComponent: QueryList<NgxSelectComponent>;
    private ngxSelectExComponent: NgxSelectComponent;

    /**
     * Fire while selecting option item
     */
    @Output() select: EventEmitter<IEvent> = new EventEmitter<IEvent>();
    @Output() close: EventEmitter<IEvent> = new EventEmitter<IEvent>();
    @Output() addNewOption: EventEmitter<IEvent> = new EventEmitter<IEvent>();
    private _optionImageParser: (item?: NgxSelectOption) => string[];
    @ViewChild('addNewOption', {static: false}) private addNewOptionElRef: ElementRef;
    private __originalEnsureVisibleElement: Function;

    private __focusSubscription: Subscription;
    private __blurSubscription: Subscription;
    private __finishedLoadingSubscription: Subscription;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgxSelectComponent} component
     * @return the {NgxSelectComponent} component
     */
    protected get selectComponent(): NgxSelectComponent {
        return this.ngxSelectExComponent;
    }

    /**
     * Get a boolean value indicating this component whether using `appendToBody`
     * @return true for appending to body; else false
     */
    public appendToBody(): boolean {
        return this.getConfigValue('appendToBody', false);
    }

    /**
     * Set a boolean value indicating this component whether using `appendToBody`
     * @param appendToBody to apply
     */
    public setAppendToBody(appendToBody?: boolean | false): void {
        this.setConfigValue('appendToBody', appendToBody);
    }

    /**
     * Get a boolean value indicating this component whether uses image for option item
     * @return true for using image; else false
     */
    public isEnabledOptionImage(): boolean {
        return this.getConfigValue('enableOptionImage', false);
    }

    /**
     * Set a boolean value indicating this component whether uses image for option item
     * @param enabledItemImage true for using image; else false
     */
    public setEnabledItemImage(enabledOptionImage?: boolean | false): void {
        this.setConfigValue('enableOptionImage', enabledOptionImage);
    }

    /**
     * Get the parser delegate to parse item image
     * @return the parser delegate to parse item image
     */
    @Input('optionImage') get optionImageParser(): (item?: NgxSelectOption) => string[] {
        return this._optionImageParser;
    }

    /**
     * Set a boolean value indicating this component whether uses image for tree-view item
     * @param _optionImageParser true for using image; else false
     */
    set optionImageParser(_optionImageParser: (item?: NgxSelectOption) => string[] | null) {
        AssertUtils.isTrueValue(this.isEnabledOptionImage(),
            'Not allow for using option image! Please apply `enableOptionImage` in config to use!');
        this._optionImageParser = _optionImageParser;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NgxSelectExComponent} class
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
            undefined);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.ngxSelectExComponent) {
            const _this: NgxSelectExComponent = this;
            this.ngxSelectExComponent = ComponentUtils.queryComponent(
                this.queryNgxSelectComponent, component => {
                    FunctionUtils.invokeTrue(
                        ObjectUtils.isNou(_this.__focusSubscription),
                        () => this.__focusSubscription = component.focus.subscribe(($event: any) => this.onSelectFocus({ event: $event })),
                        _this);
                    FunctionUtils.invokeTrue(
                        ObjectUtils.isNou(_this.__blurSubscription),
                        () => this.__focusSubscription = component.blur.subscribe(($event: any) => this.onSelectBlur({ event: $event })),
                        _this);
                    FunctionUtils.invokeTrue(
                        ObjectUtils.isNou(_this.__finishedLoadingSubscription),
                        () => this.__finishedLoadingSubscription = component.subjOptions.subscribe((value: any) => this.finishedLoading.emit(value)),
                        _this);
                });
        }
        if (!this.__originalEnsureVisibleElement
            && this.selectComponent && typeof this.selectComponent['ensureVisibleElement'] === 'function') {
            const _this: NgxSelectExComponent = this;
            this.__originalEnsureVisibleElement = this.selectComponent['ensureVisibleElement'];
            this.selectComponent['ensureVisibleElement'] = (element: HTMLElement): void => {
                _this.__overrideEnsureVisibleElement(_this, _this.selectComponent, element);
            };
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__focusSubscription);
        PromiseUtils.unsubscribe(this.__blurSubscription);
        PromiseUtils.unsubscribe(this.__finishedLoadingSubscription);
    }

    /**
     * Raise by {NgxSelectComponent#typed} event.
     * Fired on changing search input. Returns string with that value.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    onTyped($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onTyped', $event);
    }

    /**
     * Raise by {NgxSelectComponent#open} event.
     * Fired on select dropdown open.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    onOpen($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onOpen', $event);
    }

    /**
     * Raise by {NgxSelectComponent#close} event.
     * Fired on select dropdown close.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    onClose($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClose', $event);
        this.close.emit($event);
    }

    /**
     * Raise by {NgxSelectComponent#select} event.
     * Fired on an item selected by user. Returns value of the selected item.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    onSelect($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelect', $event);
        this.select.emit($event);
    }

    /**
     * Raise by {NgxSelectComponent#remove} event.
     * Fired on an item removed by user. Returns value of the removed item.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    onRemove($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onRemove', $event);
    }

    /**
     * Raise by {NgxSelectComponent#navigated} event.
     * Fired on navigate by the dropdown list. Returns: {INgxOptionNavigated}.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    onNavigated($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onNavigated', $event);
    }

    /**
     * Raise by {NgxSelectComponent#selectionChanges} event.
     * Fired on change selected options. Returns: {INgxSelectOption[]}.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    onSelectionChanges($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelectionChanges', $event);
    }

    /**
     * Raise by clicking on 'Add new option' action.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    onAddNewOption($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onAddNewOption', $event);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Override the {ensureVisibleElement} method of {NgxSelectComponent} for customizing `addNewOption`
     * TODO Unique hack for appending dropdown options to body and adding new option action if necessary
     * @param parentComponent current parent component, because this method is accessed from out-side
     * @param selectComponent {NgxSelectComponent}
     * @param element {HTMLElement}
     * @private
     */
    private __overrideEnsureVisibleElement(
        parentComponent: NgxSelectExComponent, selectComponent: NgxSelectComponent, element: HTMLElement) {
        // check for adding `addNewOption` feature
        if (selectComponent && selectComponent['choiceMenuElRef'] instanceof ElementRef) {
            // append add new option action
            const choiceMenuElRef: ElementRef = selectComponent['choiceMenuElRef'] as ElementRef;
            if (ObjectUtils.isNotNou(parentComponent.addNewOptionElRef)) {
                const addNewOptionEl: HTMLElement =
                    parentComponent.getFirstElementBySelector(
                        '.ngx-select__item_addNewOption', choiceMenuElRef.nativeElement);
                const shouldShown: boolean = parentComponent.getConfigValue('showAddNewOption', false)
                    && parentComponent.getConfigValue('addNewOptionConfig', null);
                if (ObjectUtils.isNou(addNewOptionEl) && choiceMenuElRef && shouldShown) {
                    parentComponent.getRenderer().appendChild(
                        choiceMenuElRef.nativeElement, parentComponent.addNewOptionElRef.nativeElement);
                    parentComponent.toggleElementClass(
                        parentComponent.addNewOptionElRef.nativeElement, 'd-none', false);

                }
            }

            // append to body
            if (this.appendToBody()) {
                const mainInputElRef: ElementRef = selectComponent['inputElRef'] as ElementRef;
                const shouldAppendToBody: boolean = parentComponent.getConfigValue('appendToBody', false);
                if (shouldAppendToBody && choiceMenuElRef && mainInputElRef && ObjectUtils.isNou(mainInputElRef['appendToBody'])) {
                    parentComponent.getRenderer().appendChild(
                        document.body, choiceMenuElRef.nativeElement);
                    const offset: { top: number, left: number, width: number, height: number } =
                        super.offset(mainInputElRef.nativeElement);
                    parentComponent.getRenderer().setStyle(
                        choiceMenuElRef.nativeElement,
                        'top', (offset.top + offset.height + 5) + 'px',
                        RendererStyleFlags2.Important);
                    parentComponent.getRenderer().setStyle(
                        choiceMenuElRef.nativeElement,
                        'left', offset.left + 'px',
                        RendererStyleFlags2.Important);
                    parentComponent.getRenderer().setStyle(
                        choiceMenuElRef.nativeElement,
                        'width', offset.width + 'px',
                        RendererStyleFlags2.Important);
                    mainInputElRef['appendToBody'] = true;
                }
            }
        }

        // invoke original method
        parentComponent.__originalEnsureVisibleElement
        && parentComponent.__originalEnsureVisibleElement.apply(selectComponent, [element]);
    }

    /**
     * Alias of {AbstractSelectExComponent#configValue} for 'Add new option' action
     */
    addNewActionConfig(): IToolbarActionsConfig {
        return this.getConfigValue('addNewOptionConfig', null) as IToolbarActionsConfig;
    }

    /**
     * Get the specified {NgxSelectOption} image. NULL for not using
     * @param item to parse
     * @return the specified {NgxSelectOption} image
     */
    public getOptionImages(item?: NgxSelectOption): string[] {
        const optionImageField: string = this.getConfigValue('optionImageField', '');
        return (this.optionImageParser ? this.optionImageParser.apply(this, [item])
            : optionImageField.length && item.data ? item.data[optionImageField] : null);
    }

    /**
     * Custom for option while using `appendToBody`
     * @param option {NgxSelectOption}
     * @param $event event
     */
    private clickOptionAppendToBody(option: NgxSelectOption, $event): void {
        window.console.error(['clickOptionAppendToBody', $event]);
        if (!this.appendToBody()) {
            return;
        }

        this.selectComponent.optionSelect(option, $event);
    }
}

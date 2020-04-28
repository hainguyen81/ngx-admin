import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef, EventEmitter,
    Inject, Input, Output,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractSelectExComponent} from './abstract.select.ex.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../abstract.component';
import {NgxSelectOption} from 'ngx-select-ex';
import {throwError} from 'rxjs';
import {IToolbarActionsConfig} from '../../../config/toolbar.actions.conf';

/**
 * Select component base on {NgxSelectComponent}
 */
@Component({
    selector: 'ngx-select-ex',
    templateUrl: './select.ex.component.html',
    styleUrls: ['./select.ex.component.scss'],
})
export class NgxSelectExComponent extends AbstractSelectExComponent<DataSource> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    /**
     * Fire while selecting option item
     */
    @Output() select: EventEmitter<IEvent> = new EventEmitter<IEvent>();
    @Output() addNewOption: EventEmitter<IEvent> = new EventEmitter<IEvent>();
    @Input('optionImage') private optionImageParser: (item?: NgxSelectOption) => string[];

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating this component whether uses image for option item
     * @return true for using image; else false
     */
    public isEnabledOptionImage(): boolean {
        return this.configValue('enableOptionImage', false);
    }

    /**
     * Set a boolean value indicating this component whether uses image for option item
     * @param enabledItemImage true for using image; else false
     */
    public setEnabledItemImage(enabledOptionImage?: boolean | false): void {
        this.saveConfigValue('enableOptionImage', enabledOptionImage);
    }

    /**
     * Get the parser delegate to parse item image
     * @return the parser delegate to parse item image
     */
    public getOptionImageParser(): (item?: NgxSelectOption) => string[] {
        return this.optionImageParser;
    }

    /**
     * Set a boolean value indicating this component whether uses image for tree-view item
     * @param enabledItemImage true for using image; else false
     */
    public setOptionImageParser(optionImageParser?: (item?: NgxSelectOption) => string[] | null): void {
        this.isEnabledOptionImage() || throwError(
            'Not allow for using option image! Please apply `enableOptionImage` in config to use!');
        this.optionImageParser = optionImageParser;
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
                @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            undefined);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Raise by {NgxSelectComponent#typed} event.
     * Fired on changing search input. Returns string with that value.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    protected onTyped($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onTyped', $event);
    }

    /**
     * Raise by {NgxSelectComponent#open} event.
     * Fired on select dropdown open.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    protected onOpen($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onOpen', $event);
    }

    /**
     * Raise by {NgxSelectComponent#close} event.
     * Fired on select dropdown close.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    protected onClose($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onClose', $event);
    }

    /**
     * Raise by {NgxSelectComponent#select} event.
     * Fired on an item selected by user. Returns value of the selected item.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    protected onSelect($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelect', $event);
        this.select.emit($event);
    }

    /**
     * Raise by {NgxSelectComponent#remove} event.
     * Fired on an item removed by user. Returns value of the removed item.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    protected onRemove($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onRemove', $event);
    }

    /**
     * Raise by {NgxSelectComponent#navigated} event.
     * Fired on navigate by the dropdown list. Returns: {INgxOptionNavigated}.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    protected onNavigated($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onNavigated', $event);
    }

    /**
     * Raise by {NgxSelectComponent#selectionChanges} event.
     * Fired on change selected options. Returns: {INgxSelectOption[]}.
     * @param $event {IEvent} as {IEvent#$data} is event data
     */
    protected onSelectionChanges($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onSelectionChanges', $event);
    }

    /**
     * Raise by clicking on 'Add new option' action.
     * @param $event {IEvent} as {IEvent#$event} is event data
     */
    protected onAddNewOption($event: IEvent): void {
        // TODO Waiting for implementing from children component
        this.getLogger().debug('onAddNewOption', $event);
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Get configuration value for template
     * @param key configuration key
     * @param defaultValue default if not found
     */
    private configValue(key?: string, defaultValue?: any): any {
        return (this.getConfig() && (<Object>this.getConfig()).hasOwnProperty(key)
            ? this.getConfig()[key] : defaultValue);
    }
    /**
     * Set configuration value for template
     * @param key configuration key
     * @param value to apply
     */
    private saveConfigValue(key?: string, value?: any): void {
        this.getConfig()[key] = value;
    }

    /**
     * Alias of {AbstractSelectExComponent#configValue} for 'Add new option' action
     */
    private addNewActionConfig(): IToolbarActionsConfig {
        return this.configValue('addNewOptionConfig', null) as IToolbarActionsConfig;
    }

    /**
     * Get the specified {NgxSelectOption} image. NULL for not using
     * @param item to parse
     * @return the specified {NgxSelectOption} image
     */
    public getOptionImages(item?: NgxSelectOption): string[] {
        return (this.getOptionImageParser() ? this.getOptionImageParser().apply(this, [item]) : null);
    }
}

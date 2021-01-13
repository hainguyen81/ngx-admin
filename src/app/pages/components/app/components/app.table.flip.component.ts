import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    Inject,
    InjectionToken,
    Renderer2,
    Type,
    ViewContainerRef,
} from '@angular/core';
import {ConfirmPopup} from 'ngx-material-popup';
import {IModel} from '../../../../@core/data/base';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource, Row} from '@app/types/index';
import {AppSmartTableComponent} from './app.table.component';
import {AppFlipcardComponent} from './app.flipcard.component';
import {AbstractComponent, IEvent} from '../../abstract.component';
import {AppToolbarComponent} from './app.toolbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import ObjectUtils from '../../../../utils/common/object.utils';

export const APP_TABLE_FLIP_TOOLBAR_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppToolbarComponent<any>>>
    = new InjectionToken<Type<AppToolbarComponent<any>>>(
        'The toolbar component type injection token of the flip-pane between table and another component');
export const APP_TABLE_FLIP_TABLE_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppSmartTableComponent<any>>>
    = new InjectionToken<Type<AppSmartTableComponent<any>>>(
        'The table component type injection token of the flip-pane between table and another component');
export const APP_TABLE_FLIP_BACKWARD_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AbstractComponent>>
    = new InjectionToken<Type<AbstractComponent>>(
        'The backward component type injection token of the flip-pane between table and another component');

@Component({
    selector: 'ngx-flip-card-app-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../flipcard/flipcard.component.scss',
        './app.flipcard.component.scss',
        './app.table.flip.component.scss',
    ],
})
export class AppTableFlipComponent<T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    F extends AppSmartTableComponent<D>,
    B extends AbstractComponent>
    extends AppFlipcardComponent<D, TB, F, B> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _selectedModel: T;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating whether creating back-component at start-up
     * @return true (default) for creating; else false
     */
    protected get fulfillComponentsAtStartup(): boolean {
        return false;
    }

    /**
     * Get the current selected data model
     * @return the current selected data model
     */
    protected get selectedModel(): T {
        return this._selectedModel;
    }

    /**
     * Set the current selected data model
     * @param _selectedModel to apply
     */
    protected set selectedModel(_selectedModel: T) {
        this._selectedModel = _selectedModel;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppTableFlipFormComponent} class
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
     * @param toolbarComponentType toolbar component type
     * @param tableComponentType front table component type
     * @param backComponentType back form component type
     */
    constructor(@Inject(DataSource) dataSource: D,
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(APP_TABLE_FLIP_TOOLBAR_COMPONENT_TYPE_TOKEN) toolbarComponentType?: Type<TB> | null,
                @Inject(APP_TABLE_FLIP_TABLE_COMPONENT_TYPE_TOKEN) tableComponentType?: Type<F> | null,
                @Inject(APP_TABLE_FLIP_BACKWARD_COMPONENT_TYPE_TOKEN) backComponentType?: Type<B> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            toolbarComponentType, tableComponentType, backComponentType);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        /**
         * @deprecated Instead of using {#flipFrontComponentType}, {#flipFrontComponent}
         */
        // listener
        (this.frontComponent && !this.DEPRECATED)
        && this.registerFrontComponentListeners();
    }

    /**
     * Raise when the flip front component has been created
     * @param componentRef the flip front component reference
     */
    onFrontComponentCreated(componentRef: ComponentRef<F>) {
        super.onFrontComponentCreated(componentRef);
        this.DEPRECATED && this.registerFrontComponentListeners();
    }

    /**
     * Call when table wanna add new data
     * @param $event event data {IEvent}
     */
    protected onNewData($event: IEvent): void {
        this.getLogger().debug('Flip-table wanna add new data', $event);
    }

    /**
     * Call when table wanna edit data
     * @param $event event data {IEvent}
     */
    protected onEditData($event: IEvent): void {
        this.getLogger().debug('Flip-table wanna edit data', $event);
    }

    /**
     * Call when table wanna delete data
     * @param $event event data {IEvent}
     */
    protected onDeleteData($event: IEvent): void {
        this.getLogger().debug('Flip-table wanna delete data', $event);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Register event listeners for front component
     * @deprecated Instead of using {#flipFrontComponentType}, {#flipFrontComponent}
     */
    private registerFrontComponentListeners(): void {
        const component: F = (this.DEPRECATED ? this.flipFrontComponent : this.frontComponent);
        const tableFrontComponent: AppSmartTableComponent<D> = <AppSmartTableComponent<D>>component;
        if (ObjectUtils.isNotNou(tableFrontComponent)) {
            tableFrontComponent.setNewItemListener($event => {
                this._selectedModel = null;
                !this.DEPRECATED && this.ensureBackComponent();
                this.onNewData($event);
                this.flipped = true;
            });
            tableFrontComponent.setEditItemListener($event => {
                this._selectedModel = ($event && $event.data && $event.data['row'] instanceof Row ? ($event.data['row'] as Row).getData() as T : undefined);
                !this.DEPRECATED && this.ensureBackComponent();
                this.onEditData($event);
                this.flipped = true;
            });
            tableFrontComponent.setDeleteItemListener($event => {
                this._selectedModel = ($event && $event.data && $event.data['row'] instanceof Row ? ($event.data['row'] as Row).getData() as T : undefined);
                !this.DEPRECATED && this.ensureBackComponent();
                this.onDeleteData($event);
                this.flipped = false;
            });
        }
    }

    /**
     * Perform going back data
     */
    protected doBack(): void {
        // back to front
        this._selectedModel = undefined;
        this.flipped = false;
    }
}

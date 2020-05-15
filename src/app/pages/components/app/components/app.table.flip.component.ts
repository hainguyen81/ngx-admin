import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject, Renderer2, Type,
    ViewContainerRef,
} from '@angular/core';
import {ConfirmPopup} from 'ngx-material-popup';
import {IModel} from '../../../../@core/data/base';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AppSmartTableComponent} from './app.table.component';
import {AppFlipcardComponent} from './app.flipcard.component';
import {AbstractComponent, IEvent} from '../../abstract.component';
import {AppToolbarComponent} from './app.toolbar.component';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {ActivatedRoute, Router} from '@angular/router';

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
export abstract class AppTableFlipComponent<
    T extends IModel, D extends DataSource,
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
    protected fulfillComponentsAtStartup(): boolean {
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
     * @param formComponentType back form component type
     */
    protected constructor(@Inject(DataSource) dataSource: D,
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
                          toolbarComponentType?: Type<TB> | null,
                          tableComponentType?: Type<F> | null,
                          formComponentType?: Type<B> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            toolbarComponentType, tableComponentType, formComponentType);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // listener
        if (super.getFrontComponent()) {
            (<AppSmartTableComponent<D>>super.getFrontComponent())
                .setNewItemListener($event => {
                    this._selectedModel = null;
                    this.ensureBackComponent();
                    this.onNewData($event);
                    this.setFlipped(true);
                });
            (<AppSmartTableComponent<D>>super.getFrontComponent())
                .setEditItemListener($event => {
                    this._selectedModel = ($event && $event.data
                        && $event.data['row'] instanceof Row
                        ? ($event.data['row'] as Row).getData() as T : undefined);
                    this.ensureBackComponent();
                    this.onEditData($event);
                    this.setFlipped(true);
                });
            (<AppSmartTableComponent<D>>super.getFrontComponent())
                .setDeleteItemListener($event => {
                    this._selectedModel = ($event && $event.data
                    && $event.data['row'] instanceof Row
                        ? ($event.data['row'] as Row).getData() as T : undefined);
                    this.ensureBackComponent();
                    this.onDeleteData($event);
                    this.setFlipped(false);
                });
        }
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
     * Perform going back data
     */
    protected doBack(): void {
        // back to front
        this._selectedModel = undefined;
        this.setFlipped(false);
    }
}

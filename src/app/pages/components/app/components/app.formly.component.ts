import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {
    AfterViewInit,
    ChangeDetectorRef, Component,
    ComponentFactoryResolver, ElementRef,
    Inject, Renderer2, Type,
    ViewContainerRef,
} from '@angular/core';
import {BaseFormlyComponent} from '../../formly/base.formly.component';
import {ConfirmPopup} from 'ngx-material-popup';
import {IModel} from '../../../../@core/data/base';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AppToolbarComponent} from './app.toolbar.component';
import {isNullOrUndefined} from 'util';
import {IEvent} from '../../abstract.component';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../toolbar/abstract.toolbar.component';
import {ACTION_BACK} from '../warehouse/item/warehouse.item.toolbar.component';

/**
 * Form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form-app',
    templateUrl: '../../formly/formly.component.html',
    styleUrls: ['../../formly/formly.component.scss', './app.formly.component.scss'],
})
export abstract class AppFormlyComponent<
    T extends IModel, D extends DataSource, TB extends AppToolbarComponent<D>>
    extends BaseFormlyComponent<T, D> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private toolbarComponent: TB;
    private toolbarActionsListener: (e: IEvent) => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected isShowHeader(): boolean {
        return !isNullOrUndefined(this.getToolbarComponent());
    }

    /**
     * Get the front-flip {AbstractComponent} instance
     * @return the front-flip {AbstractComponent} instance
     */
    protected getToolbarComponent(): TB {
        return this.toolbarComponent;
    }

    /**
     * Set the toolbar actions listener
     * @param listener to apply
     */
    public setToolbarActionsListener(listener: (e: IEvent) => void): void {
        this.toolbarActionsListener = listener;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlyComponent} class
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
                          private toolbarComponentType?: Type<TB> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.toolbarComponent && this.toolbarComponentType
            && super.getHeaderViewContainerComponent()) {
            this.toolbarComponent = super.createComponentAt(
                super.getHeaderViewContainerComponent(), this.toolbarComponentType);
            this.toolbarComponent.actionListener().subscribe((e: IEvent) => this.onClickAction(e));
        }
        this.getFormlyForm().modelChange.subscribe(() => this.onModelChanged());
    }

    /**
     * Raise when the model of form had been changed
     */
    protected onModelChanged() {
        this.getLogger().debug('onModelChanged', this.getModel());
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        if (!event || !event.$data || !(event.$data as IToolbarActionsConfig)) {
            return;
        }
        if (!this.toolbarActionsListener) {
            let action: IToolbarActionsConfig;
            action = event.$data as IToolbarActionsConfig;
            switch (action.id) {
                case ACTION_SAVE:
                    // TODO Waiting for saving
                    break;
                case ACTION_RESET:
                    // TODO Waiting for resetting
                    break;
                case ACTION_DELETE:
                    // TODO Waiting for deleting
                    break;
                case ACTION_BACK:
                    // TODO Waiting for backing
                    break;
            }
        } else this.toolbarActionsListener.apply(this, [ event ]);
    }
}

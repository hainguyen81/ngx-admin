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
import {AppFormlyComponent} from './app.formly.component';
import {AppFlipcardComponent} from './app.flipcard.component';
import {IEvent} from '../../abstract.component';

@Component({
    selector: 'ngx-flip-card-app-table-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../flipcard/flipcard.component.html',
    styleUrls: ['../../flipcard/flipcard.component.scss', './app.flipcard.component.scss'],
})
export abstract class AppTableFlipFormComponent<
    T extends IModel, D extends DataSource,
    F extends AppSmartTableComponent<D>,
    B extends AppFormlyComponent<T, D, any>>
    extends AppFlipcardComponent<D, F, B> implements AfterViewInit {

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
                          tableComponentType?: Type<F> | null,
                          formComponentType?: Type<B> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            tableComponentType, formComponentType);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // listener
        if (super.getFrontComponent()) {
            (<AppSmartTableComponent<D>>super.getFrontComponent())
                .setNewItemListener($event => { this.onNewData($event); this.setFlipped(true); });
            (<AppSmartTableComponent<D>>super.getFrontComponent())
                .setEditItemListener($event => { this.onEditData($event); this.setFlipped(true); });
            (<AppSmartTableComponent<D>>super.getFrontComponent()).setDeleteItemListener(this.onDeleteData);
        }
        if (super.getBackComponent()) {
            (<AppFormlyComponent<T, D, any>>super.getBackComponent()).setToolbarActionsListener(this.onToolbarAction);
        }
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param $event event data {IEvent}
     */
    protected onToolbarAction($event: IEvent) {
        this.getLogger().debug('Flip-form-toolbar wanna perform action', $event);
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
}

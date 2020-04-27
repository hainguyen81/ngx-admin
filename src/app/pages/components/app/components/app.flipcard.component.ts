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
import {ConfirmPopup, ConfirmPopupConfig} from 'ngx-material-popup';
import {ContextMenuService} from 'ngx-contextmenu';
import {BaseFlipcardComponent} from '../../flipcard/base.flipcard.component';
import {Lightbox} from 'ngx-lightbox';
import {AbstractComponent, IEvent} from '../../abstract.component';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {throwError} from 'rxjs';
import {ACTION_DELETE_DATABASE, AppToolbarComponent} from './app.toolbar.component';
import {
    ACTION_DELETE,
    ACTION_RESET,
    ACTION_SAVE,
    IToolbarActionsConfig,
} from '../../toolbar/abstract.toolbar.component';
import {ACTION_BACK} from '../warehouse/item/warehouse.item.toolbar.component';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import AppUtils from '../../../../utils/app.utils';
import {Router} from '@angular/router';
import {AppConfig} from '../../../../config/app.config';
import {
    NgxLocalStorageEncryptionService,
} from '../../../../services/storage.services/local.storage.services';

@Component({
    selector: 'ngx-flip-card-app',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../flipcard/flipcard.component.html',
    styleUrls: ['../../flipcard/flipcard.component.scss', './app.flipcard.component.scss'],
})
export abstract class AppFlipcardComponent<
    D extends DataSource,
    TB extends AppToolbarComponent<D>,
    F extends AbstractComponent,
    B extends AbstractComponent>
    extends BaseFlipcardComponent<D> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private toolbarComponent: TB;
    private frontComponent: F;
    private backComponent: B;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating whether showing panel header
     * @return true (default) for showing; else false
     */
    protected isShowHeader(): boolean {
        return true;
    }

    /**
     * Get the toolbar {AppToolbarComponent} instance
     * @return the toolbar {AppToolbarComponent} instance
     */
    protected getToolbarComponent(): TB {
        return this.toolbarComponent;
    }

    /**
     * Get the front-flip {AbstractComponent} instance
     * @return the front-flip {AbstractComponent} instance
     */
    protected getFrontComponent(): F {
        return this.frontComponent;
    }

    /**
     * Get the back-flip {AbstractComponent} instance
     * @return the back-flip {AbstractComponent} instance
     */
    protected getBackComponent(): B {
        return this.backComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFlipcardComponent} class
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
                          private toolbarComponentType?: Type<TB> | null,
                          private frontComponentType?: Type<F> | null,
                          private backComponentType?: Type<B> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        frontComponentType || throwError('The front-flip component type is required');
        backComponentType || throwError('The back-flip component type is required');
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // Create flip components
        this.createFlipComponents();
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param event {IEvent} that contains {$event} as {MouseEvent} and {$data} as {IToolbarActionsConfig}
     */
    onClickAction(event: IEvent) {
        if (!event || !event.data || !(event.data as IToolbarActionsConfig)) {
            return;
        }
        let action: IToolbarActionsConfig;
        action = event.data as IToolbarActionsConfig;
        switch (action.id) {
            case ACTION_SAVE:
                // TODO Waiting for saving
                this.doSave();
                break;
            case ACTION_RESET:
                // TODO Waiting for resetting
                this.doReset();
                break;
            case ACTION_DELETE:
                // TODO Waiting for deleting
                this.doDelete();
                break;
            case ACTION_BACK:
                if (this.isDataChanged()) {
                    let popupConfig: ConfirmPopupConfig;
                    popupConfig = {
                        title: this.translate('app'),
                        content: this.translate('common.toast.confirm.lose_data.message'),
                        color: 'warn',
                        cancelButton: this.translate('common.toast.confirm.lose_data.cancel'),
                        okButton: this.translate('common.toast.confirm.lose_data.ok'),
                    };
                    this.getConfirmPopup().show(popupConfig)
                        .subscribe(value => {
                            if (value) {
                                this.doBack();
                                this.setFlipped(false);
                            }
                        });

                } else {
                    this.setFlipped(false);
                }
                break;
            case ACTION_DELETE_DATABASE:
                this.doDeleteDatabase();
                break;
            default:
                this.onToolbarAction(event);
                break;
        }
    }

    /**
     * Raise when toolbar action item has been clicked
     * @param $event event data {IEvent}
     */
    protected onToolbarAction($event: IEvent) {
        this.getLogger().debug('Flip-form-toolbar wanna perform action', $event);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create flip view components
     */
    private createFlipComponents(): void {
        // create table component
        this.toolbarComponent = super.setToolbarComponent(this.toolbarComponentType);
        this.toolbarComponent
        && this.toolbarComponent.actionListener()
            .subscribe($event => this.onClickAction($event));
        this.frontComponent = super.setFrontComponent(this.frontComponentType);
        this.backComponent = super.setBackComponent(this.backComponentType);
    }

    /**
     * Get a boolean value indicating data that has been changed to shown confirmation dialog while back flip
     * TODO Children classes should override this method
     * @return true for changed; else false
     */
    protected isDataChanged(): boolean {
        return false;
    }

    /**
     * Perform saving data
     */
    protected doSave(): void {
        this.getLogger().debug('Perform save action!');
    }

    /**
     * Perform resetting data
     */
    protected doReset(): void {
        this.getLogger().debug('Perform reset action!');
    }

    /**
     * Perform deleting data
     */
    protected doDelete(): void {
        this.getLogger().debug('Perform delete action!');
    }

    /**
     * Perform going back data
     */
    protected doBack(): void {
        this.getLogger().debug('Perform going back action!');
    }

    /**
     * Perform deleting database
     */
    private doDeleteDatabase() {
        const _this: AppFlipcardComponent<D, TB, F, B> = this;
        let popupConfig: ConfirmPopupConfig;
        popupConfig = {
            title: this.translate('app'),
            content: this.translate('common.toast.confirm.delete_database.message'),
            color: 'warn',
            cancelButton: this.translate('common.toast.confirm.delete_database.cancel'),
            okButton: this.translate('common.toast.confirm.delete_database.ok'),
        };
        this.getConfirmPopup().show(popupConfig)
            .subscribe(value => value && _this.clearData());
    }
    private clearData(): void {
        const _this: AbstractComponent = this;
        const indexDbService: NgxIndexedDBService = AppUtils.getService(NgxIndexedDBService);
        const location: Location = AppUtils.getService(Location);
        const router: Router = AppUtils.getService(Router);
        const localStorage: NgxLocalStorageEncryptionService =
            AppUtils.getService(NgxLocalStorageEncryptionService);
        const logger: NGXLogger = this.getLogger();
        indexDbService || throwError('Could not inject NgxIndexedDBService instance');
        location || throwError('Could not inject Location instance');
        router || throwError('Could not inject Router instance');
        localStorage || throwError('Could not inject NgxLocalStorageEncryptionService instance');
        const indexDbDelRequest = window.indexedDB.deleteDatabase(AppConfig.Db.name);
        indexDbDelRequest.onerror = function(event) {
            logger && logger.error('Could not delete database!', event);
            !logger && window.console.error(['Could not delete database!', event]);
        };
        indexDbDelRequest.onsuccess = function(event) {
            localStorage.clear();
            router.navigate([_this.baseHref]);
            location.reload();
        };
    }
}

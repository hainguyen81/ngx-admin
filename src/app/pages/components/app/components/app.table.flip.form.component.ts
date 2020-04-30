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
import {AppToolbarComponent} from './app.toolbar.component';
import {DeepCloner} from '../../../../utils/object.utils';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {IdGenerators} from '../../../../config/generator.config';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'ngx-flip-card-app-table-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../flipcard/flipcard.component.scss',
        './app.flipcard.component.scss',
        './app.table.flip.form.component.scss',
    ],
})
export abstract class AppTableFlipFormComponent<
    T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    F extends AppSmartTableComponent<D>,
    B extends AppFormlyComponent<T, D>>
    extends AppFlipcardComponent<D, TB, F, B> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _selectedModel: T;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the current selected data model
     * @return the current selected data model
     */
    protected get selectedModel(): T {
        return this._selectedModel;
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
                    this.onNewData($event);
                    this.setFlipped(true);
                });
            (<AppSmartTableComponent<D>>super.getFrontComponent())
                .setEditItemListener($event => {
                    this._selectedModel = ($event && $event.data
                        && $event.data['row'] instanceof Row
                        ? ($event.data['row'] as Row).getData() as T : undefined);
                    this.onEditData($event);
                    this.setFlipped(true);
                });
            (<AppSmartTableComponent<D>>super.getFrontComponent())
                .setDeleteItemListener($event => {
                    this._selectedModel = ($event && $event.data
                    && $event.data['row'] instanceof Row
                        ? ($event.data['row'] as Row).getData() as T : undefined);
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

    protected isDataChanged(): boolean {
        return this.getBackComponent().getFormGroup().dirty;
    }

    /**
     * Perform going back data
     */
    protected doBack(): void {
        // back to front
        this._selectedModel = undefined;
        this.setFlipped(false);
    }

    /**
     * Perform saving data
     */
    protected doSave(): void {
        this.getBackComponent().getFormGroup().updateValueAndValidity();
        if (this.getBackComponent().getFormGroup().invalid) {
            if (this.getToolbarComponent()) {
                this.showError(this.getToolbarComponent().getToolbarHeader().title,
                    'common.form.invalid_data');
            } else {
                this.showError('app', 'common.form.invalid_data');
            }
            return;
        }

        // update model if necessary
        const model: T = this.getBackComponent().getModel();
        model.id = model.id || IdGenerators.oid.generate();
        this.getDataSource().update(this.selectedModel, model)
            .then(() => { this.showSaveDataSuccess(); this.doBack(); })
            .catch(() => this.showSaveDataError());
    }

    /**
     * Perform resetting data
     */
    protected doReset(): void {
        const cloned: T = DeepCloner(this.selectedModel);
        delete cloned['parent'], cloned['children'];
        this.getBackComponent().setModel(cloned);
    }

    /**
     * Perform deleting data
     */
    protected doDelete(): void {
        this.getConfirmPopup().show({
            cancelButton: this.translate('common.toast.confirm.delete.cancel'),
            color: 'warn',
            content: this.translate('common.toast.confirm.delete.message'),
            okButton: this.translate('common.toast.confirm.delete.ok'),
            title: (!this.getToolbarComponent() ? this.translate('app')
                : this.translate(this.getToolbarComponent().getToolbarHeader().title)),
        }).toPromise().then(value => {
            value && this.getDataSource().remove(this.getBackComponent().getModel())
                .then(() => { this.showDeleteDataSuccess(); this.doBack(); })
                .catch(() => this.showSaveDataError());
        });
    }
}

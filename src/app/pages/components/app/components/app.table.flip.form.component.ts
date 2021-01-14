import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
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
import {DataSource} from '@app/types/index';
import {AppSmartTableComponent} from './app.table.component';
import {AppFormlyComponent} from './app.formly.component';
import {AppToolbarComponent} from './app.toolbar.component';
import {DeepCloner} from '../../../../utils/common/object.utils';
import {IdGenerators} from '../../../../config/generator.config';
import {ActivatedRoute, Router} from '@angular/router';
import {AppTableFlipComponent} from './app.table.flip.component';

export const APP_TABLE_FLIP_FORM_TOOLBAR_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppToolbarComponent<any>>>
    = new InjectionToken<Type<AppToolbarComponent<any>>>('The toolbar component type injection token of the flip-pane between table and form');
export const APP_TABLE_FLIP_FORM_TABLE_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppSmartTableComponent<any>>>
    = new InjectionToken<Type<AppSmartTableComponent<any>>>('The table component type injection token of the flip-pane between table and form');
export const APP_TABLE_FLIP_FORM_FORM_COMPONENT_TYPE_TOKEN: InjectionToken<Type<AppFormlyComponent<any, any>>>
    = new InjectionToken<Type<AppFormlyComponent<any, any>>>('The table component type injection token of the flip-pane between table and form');

@Component({
    selector: 'ngx-flip-app-table-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../flip/flip.component.html',
    styleUrls: [
        '../../flip/flip.component.scss',
        './app.flip.component.scss',
        './app.table.flip.component.scss',
    ],
})
export class AppTableFlipFormComponent<T extends IModel, D extends DataSource,
    TB extends AppToolbarComponent<D>,
    F extends AppSmartTableComponent<D>,
    B extends AppFormlyComponent<T, D>>
    extends AppTableFlipComponent<T, D, TB, F, B> implements AfterViewInit {

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
     * @param formComponentType front form component type
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
                @Inject(APP_TABLE_FLIP_FORM_TOOLBAR_COMPONENT_TYPE_TOKEN) toolbarComponentType?: Type<TB> | null,
                @Inject(APP_TABLE_FLIP_FORM_TABLE_COMPONENT_TYPE_TOKEN) tableComponentType?: Type<F> | null,
                @Inject(APP_TABLE_FLIP_FORM_FORM_COMPONENT_TYPE_TOKEN) formComponentType?: Type<B> | null) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            toolbarComponentType, tableComponentType, formComponentType);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Detect data whether has been changed
     */
    protected get isDataChanged(): boolean {
        const component: B = this.backComponent;
        return (component && component.getFormGroup() && component.getFormGroup().dirty);
    }

    /**
     * Perform saving data
     */
    protected doSave(): void {
        const backComponent: B = this.backComponent;
        const toolbarComponent: TB = this.toolbarComponent;
        if (!backComponent || !backComponent.submit()) {
            if (toolbarComponent) {
                this.showError(toolbarComponent.getToolbarHeader().title, 'common.form.invalid_data');
            } else {
                this.showError('app', 'common.form.invalid_data');
            }
            return;
        }

        // update model if necessary
        const model: T = backComponent.getModel();
        if (!(model.id || '').length) {
            model.id = IdGenerators.oid.generate();
        }
        this.getDataSource().update(this.selectedModel, model)
            .then(() => {
                this.showSaveDataSuccess();
                this.doBack();
            })
            .catch(() => this.showSaveDataError());
    }

    /**
     * Perform resetting data
     */
    protected doReset(): void {
        const backComponent: B = this.backComponent;
        const cloned: T = DeepCloner(this.selectedModel);
        delete cloned['parent'], cloned['children'];
        backComponent && backComponent.setModel(cloned);
    }

    /**
     * Perform deleting data
     */
    protected doDelete(): void {
        const backComponent: B = this.backComponent;
        const toolbarComponent: TB = this.toolbarComponent;
        this.getConfirmPopup().show({
            cancelButton: this.translate('common.toast.confirm.delete.cancel'),
            color: 'warn',
            content: this.translate('common.toast.confirm.delete.message'),
            okButton: this.translate('common.toast.confirm.delete.ok'),
            title: (!toolbarComponent ? this.translate('app') : this.translate(toolbarComponent.getToolbarHeader().title)),
        }).toPromise().then(value => {
            value && this.getDataSource().remove(backComponent.getModel()).then(() => {
                this.showDeleteDataSuccess();
                this.doBack();
            })
            .catch(() => this.showSaveDataError());
        });
    }
}

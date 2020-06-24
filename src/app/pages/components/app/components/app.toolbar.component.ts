import {
    ChangeDetectorRef, Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {BaseNgxToolbarComponent} from '../../toolbar/base.toolbar.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {COMMON} from '../../../../config/common.config';
import {
    ACTION_BACK,
    ACTION_DELETE_DATABASE,
    ACTION_IMPORT,
    ACTION_SERVICE_WORKER,
    IToolbarActionsConfig,
} from '../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';

/* default warehouse item toolbar actions config */
export const AppToolbarActionsConfig: IToolbarActionsConfig[] = [].concat(COMMON.baseToolbarActions);
export const AppToolbarBackActionsConfig: IToolbarActionsConfig[] =
    [].concat(AppToolbarActionsConfig)
        .concat([{
            id: ACTION_BACK,
            label: 'common.form.action.back',
            type: 'button',
            status: 'default',
            icon: {icon: 'chevron-circle-left', pack: 'fa'},
            size: 'small',
            shape: 'rectangle',
        }]);
export const AppToolbarImportActionsConfig: IToolbarActionsConfig[] =
    [].concat([{
        id: ACTION_IMPORT,
        label: 'common.form.action.import',
        type: 'button',
        status: 'success',
        icon: {icon: 'upload', pack: 'fa'},
        size: 'small',
        shape: 'rectangle',
    }]).concat(AppToolbarBackActionsConfig);
export const AppToolbarServiceWorkerExecActionsConfig: IToolbarActionsConfig[] =
    [].concat([{
        id: ACTION_SERVICE_WORKER,
        label: 'common.form.action.sw_exec',
        type: 'button',
        status: 'success',
        icon: {icon: 'headset', pack: 'fas'},
        size: 'small',
        shape: 'rectangle',
    }]).concat(AppToolbarImportActionsConfig);
export const AppToolbarDeleteDbActionsConfig: IToolbarActionsConfig[] =
    [].concat([{
        id: ACTION_DELETE_DATABASE,
        label: 'common.form.action.deletedb',
        type: 'button',
        status: 'danger',
        icon: {icon: 'eraser', pack: 'fa'},
        size: 'small',
        shape: 'rectangle',
    }]).concat(AppToolbarImportActionsConfig);

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    selector: 'ngx-toolbar-app',
    templateUrl: '../../toolbar/toolbar.component.html',
    styleUrls: ['../../toolbar/toolbar.component.scss', './app.toolbar.component.scss'],
})
export class AppToolbarComponent<D extends DataSource>
    extends BaseNgxToolbarComponent<D> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppToolbarComponent} class
     * @param dataSource {Datasource}
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
     * @param headerConfig {IToolbarHeaderConfig}
     * @param actionsConfig {IToolbarActionsConfig}
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.setActions(AppToolbarBackActionsConfig);
    }
}

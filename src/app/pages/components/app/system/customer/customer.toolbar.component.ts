import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef,} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppToolbarComponent, AppToolbarImportActionsConfig,} from '../../components/app.toolbar.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {CustomerDatasource} from '../../../../../services/implementation/system/customer/customer.datasource';
import {IToolbarActionsConfig, IToolbarHeaderConfig} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';

/* default customer toolbar header config */
export const CustomerToolbarHeaderConfig: IToolbarHeaderConfig = {
    title: 'system.customer.title',
    icon: {icon: 'address-card', pack: 'fa'},
};

/* default customer toolbar actions config */
export const CustomerToolbarActionsConfig: IToolbarActionsConfig[] = [].concat(AppToolbarImportActionsConfig);

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.SYSTEM_CUSTOMER,
    selector: 'ngx-toolbar-app-system-customer',
    templateUrl: '../../../toolbar/toolbar.component.html',
    styleUrls: ['../../../toolbar/toolbar.component.scss',
        '../../components/app.toolbar.component.scss'],
})
export class CustomerToolbarComponent
    extends AppToolbarComponent<CustomerDatasource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CustomerToolbarComponent} class
     * @param dataSource {CustomerDatasource}
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
    constructor(@Inject(CustomerDatasource) dataSource: CustomerDatasource,
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
        super.setToolbarHeader(CustomerToolbarHeaderConfig);
        super.setActions(CustomerToolbarActionsConfig);
    }
}

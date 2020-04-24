import {OrganizationDataSource} from '../../../../../services/implementation/system/organization/organization.datasource';
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
import {IToolbarActionsConfig, IToolbarHeaderConfig} from '../../../toolbar/abstract.toolbar.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppToolbarComponent} from '../../components/app.toolbar.component';
import {MODULE_CODES} from '../../../../../config/api.config';

/* default organization toolbar header config */
export const OrganizationToolbarHeaderConfig: IToolbarHeaderConfig = {
    title: 'system.organization.title',
    icon: {icon: 'sitemap', pack: 'fa'},
};

/* default organization toolbar actions config */
export const OrganizationToolbarActionsConfig: IToolbarActionsConfig[] = [].concat(COMMON.baseToolbarActions);

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    moduleId: MODULE_CODES.SYSTEM_ORGANIZATION,
    selector: 'ngx-toolbar-app-organization',
    templateUrl: '../../../toolbar/toolbar.component.html',
    styleUrls: ['../../../toolbar/toolbar.component.scss', '../../components/app.toolbar.component.scss'],
})
export class OrganizationToolbarComponent extends AppToolbarComponent<OrganizationDataSource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {OrganizationToolbarComponent} class
     * @param dataSource {OrganizationDataSource}
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
    constructor(@Inject(OrganizationDataSource) dataSource: OrganizationDataSource,
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
            modalDialogService, confirmPopup, lightbox);
        super.setToolbarHeader(OrganizationToolbarHeaderConfig);
        super.setActions(OrganizationToolbarActionsConfig);
    }
}

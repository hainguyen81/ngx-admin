import {
    ChangeDetectorRef,
    Component,
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
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppToolbarBackActionsConfig, AppToolbarComponent} from '../../components/app.toolbar.component';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';

/* default user toolbar header config */
export const UserToolbarHeaderConfig: IToolbarHeaderConfig = {
    title: 'system.user.title',
    icon: {icon: 'users', pack: 'fa'},
};

/* default user toolbar actions config */
export const UserToolbarActionsConfig: IToolbarActionsConfig[] = AppToolbarBackActionsConfig;

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    moduleId: MODULE_CODES.SYSTEM_USER,
    selector: 'ngx-toolbar-app-system-user',
    templateUrl: '../../../toolbar/toolbar.component.html',
    styleUrls: ['../../../toolbar/toolbar.component.scss',
        '../../components/app.toolbar.component.scss'],
})
export class UserToolbarComponent
    extends AppToolbarComponent<UserDataSource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {UserToolbarComponent} class
     * @param dataSource {UserDataSource}
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
    constructor(@Inject(UserDataSource) dataSource: UserDataSource,
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
        super.setToolbarHeader(UserToolbarHeaderConfig);
        super.setActions(UserToolbarActionsConfig);
    }
}
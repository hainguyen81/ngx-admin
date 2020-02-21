import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {BaseNgxToolbarComponent} from '../../../toolbar/base.toolbar.component';
import {IToolbarActionsConfig, IToolbarHeaderConfig} from '../../../toolbar/abstract.toolbar.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {CategoriesDataSource} from '../../../../../services/implementation/categories/categories.datasource';

/* default category toolbar header config */
export const CategoryToolbarHeaderConfig: IToolbarHeaderConfig = {
    title: 'system.categories.title',
    icon: {icon: 'sitemap', pack: 'fa'},
};

/* default category toolbar actions config */
export const CategoryToolbarActionsConfig: IToolbarActionsConfig[] = [].concat(COMMON.baseToolbarActions);

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    selector: 'ngx-toolbar-category',
    templateUrl: '../../../toolbar/toolbar.component.html',
    styleUrls: ['../../../toolbar/toolbar.component.scss', './category.toolbar.component.scss'],
})
export class CategoryToolbarComponent extends BaseNgxToolbarComponent<CategoriesDataSource> {
    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CategoryToolbarComponent} class
     * @param dataSource {CategoriesDataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     */
    constructor(@Inject(CategoriesDataSource) dataSource: CategoriesDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
            modalDialogService, confirmPopup,
            CategoryToolbarHeaderConfig, CategoryToolbarActionsConfig);
    }
}

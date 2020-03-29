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
import {BaseNgxToolbarComponent} from '../../../toolbar/base.toolbar.component';
import {ACTION_RESET, IToolbarActionsConfig, IToolbarHeaderConfig} from '../../../toolbar/abstract.toolbar.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';

/* default warehouse item toolbar header config */
export const WarehouseItemToolbarHeaderConfig: IToolbarHeaderConfig = {
    title: 'warehouse.item.title',
    icon: {icon: 'boxes', pack: 'fa'},
};

/* default warehouse item toolbar actions config */
export const ACTION_BACK: string = 'ACTION_BACK';
export const WarehouseItemToolbarActionsConfig: IToolbarActionsConfig[] =
    [].concat(COMMON.baseToolbarActions)
        .concat([{
            id: ACTION_BACK,
            label: 'common.form.action.back',
            type: 'button',
            status: 'default',
            icon: {icon: 'chevron-circle-left', pack: 'fa'},
            size: 'small',
            shape: 'rectangle',
        }]);

/**
 * Toolbar component base on {MatToolbar}
 */
@Component({
    selector: 'ngx-toolbar-warehouse-item',
    templateUrl: '../../../toolbar/toolbar.component.html',
    styleUrls: ['../../../toolbar/toolbar.component.scss', './warehouse.item.toolbar.component.scss'],
})
export class WarehouseItemToolbarComponent extends BaseNgxToolbarComponent<WarehouseItemDatasource> {
    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemToolbarComponent} class
     * @param dataSource {WarehouseItemDatasource}
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
     */
    constructor(@Inject(WarehouseItemDatasource) dataSource: WarehouseItemDatasource,
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
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup,
            WarehouseItemToolbarHeaderConfig, WarehouseItemToolbarActionsConfig);
    }
}

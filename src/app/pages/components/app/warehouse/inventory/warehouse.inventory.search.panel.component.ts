import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, Renderer2, ViewContainerRef,} from '@angular/core';
import {IWarehouseInventorySearch} from '../../../../../@core/data/warehouse/extension/warehouse.inventory.search';
import {DataSource, LocalDataSource} from '@app/types/index';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {WarehouseInventorySearchFormlyComponent} from './warehouse.inventory.search.formly.component';
import {WarehouseInventorySearchToolbarComponent} from './warehouse.inventory.search.toolbar.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {AppSearchPanelComponent} from '../../components/app.search.panel.component';
import {ACTION_SEARCH} from '../../../../../config/toolbar.actions.conf';

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-card-panel-app-warehouse-inventory-search',
    templateUrl: '../../../panel/panel.component.html',
    styleUrls: [
        '../../../panel/panel.component.scss',
        '../../components/app.search.panel.component.scss',
        './warehouse.inventory.search.panel.component.scss',
    ],
})
export class WarehouseInventorySearchComponent
    extends AppSearchPanelComponent<IWarehouseInventorySearch, DataSource,
        WarehouseInventorySearchFormlyComponent,
        WarehouseInventorySearchToolbarComponent>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected visibleSearchActions(): String[] {
        return [ ACTION_SEARCH ];
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventorySearchComponent} class
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
    constructor(@Inject(DataSource) dataSource: LocalDataSource,
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
            router, activatedRoute,
            WarehouseInventorySearchFormlyComponent,
            WarehouseInventorySearchToolbarComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();
        this.panelClass = 'search-panel';
        this.headerClass = 'search-header';
        this.bodyClass = 'search-body';
        this.footerClass = 'search-footer';
    }
}

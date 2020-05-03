import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {WarehouseItemDatasource} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {WarehouseItemSmartTableComponent} from './warehouse.item.table.component';
import {WarehouseItemSplitPaneComponent} from './warehouse.item.splitpane.component';
import {Lightbox} from 'ngx-lightbox';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {WarehouseItemToolbarComponent} from './warehouse.item.toolbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AppTableFlipComponent} from '../../components/app.table.flip.component';
import WarehouseItem, {IWarehouseItem} from '../../../../../@core/data/warehouse/warehouse.item';
import {
    ACTION_BACK,
    ACTION_DELETE,
    ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
} from '../../../../../config/toolbar.actions.conf';
import {IEvent} from '../../../abstract.component';
import {IdGenerators} from '../../../../../config/generator.config';

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-flip-card-app-table-warehouse-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../../flipcard/flipcard.component.scss',
        '../../components/app.flipcard.component.scss',
        '../../components/app.table.flip.component.scss',
        './warehouse.item.flipcard.component.scss',
    ],
})
export class WarehouseItemFlipcardComponent
    extends AppTableFlipComponent<
        IWarehouseItem, WarehouseItemDatasource,
        WarehouseItemToolbarComponent,
        WarehouseItemSmartTableComponent,
        WarehouseItemSplitPaneComponent>
    implements AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected visibleSpecialActionsOnFront(): String[] {
        return [ACTION_IMPORT];
    }

    protected visibleActionsOnBack(): String[] {
        return [ACTION_SAVE, ACTION_RESET, ACTION_DELETE, ACTION_BACK];
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseItemFlipcardComponent} class
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
     * @param lightbox {Lightbox}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            WarehouseItemToolbarComponent,
            WarehouseItemSmartTableComponent,
            WarehouseItemSplitPaneComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected onNewData($event: IEvent): void {
        this.selectedModel = new WarehouseItem(IdGenerators.oid.generate(), null, null);
        super.getBackComponent().setDataModel(this.selectedModel);
    }

    protected onEditData($event: IEvent): void {
        super.getBackComponent().setDataModel(this.selectedModel);
    }

    protected doSave(): void {
        if (!this.getBackComponent().submit()) {
            return;
        }

        const data: IWarehouseItem[] = [this.selectedModel]
            .concat(this.getBackComponent().getDataModelVersions());
        (<WarehouseItemDatasource>this.getDataSource()).save(data)
            .then(value => {
                this.showSaveDataSuccess();
                this.doBack();
            }, reason => this.showSaveDataError())
            .catch(reason => this.showSaveDataError());
    }
}

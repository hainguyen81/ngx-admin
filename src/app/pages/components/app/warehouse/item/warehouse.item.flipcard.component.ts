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
import {
    WarehouseItemDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.datasource';
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
import ObjectUtils from '../../../../../utils/common/object.utils';

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
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

    protected get visibleSpecialActionsOnFront(): String[] {
        return [ACTION_IMPORT];
    }

    protected get visibleActionsOnBack(): String[] {
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
        this.selectedModel.status = Object.keys(CommonConstants.COMMON.STATUS)
            .find(key => ObjectUtils.any(CommonConstants.COMMON.STATUS)[key] === CommonConstants.COMMON.STATUS.ACTIVATED);
        this.backComponent.setDataModel(ObjectUtils.deepCopy(this.selectedModel));
    }

    protected onEditData($event: IEvent): void {
        this.backComponent.setDataModel(ObjectUtils.deepCopy(this.selectedModel));
    }

    protected doReset(): void {
        this.backComponent.setDataModel(ObjectUtils.deepCopy(this.selectedModel));
    }

    protected doSave(): void {
        if (!this.backComponent.submit()) {
            return;
        }

        const versions: IWarehouseItem[] = this.backComponent.getDataModelVersions() || [];
        this.selectedModel = Object.assign({}, this.backComponent.getDataModel());
        this.selectedModel.is_version = 0;
        this.selectedModel.versions = versions.length;
        versions.forEach(version => {
            version.item_id = this.selectedModel.id;
            version.item_code = this.selectedModel.code;
            version.is_version = 1;
            version.versions = 0;
        });

        const data: IWarehouseItem[] = [this.selectedModel].concat(versions);
        const ds: WarehouseItemDatasource = <WarehouseItemDatasource>this.getDataSource();
        ds.save(data).then(value => {
            this.showSaveDataSuccess();
            // refresh data source
            ds.reset(true);
            ds.refresh();
            this.doBack();
        }, reason => this.showSaveDataError())
        .catch(reason => this.showSaveDataError());
    }
}

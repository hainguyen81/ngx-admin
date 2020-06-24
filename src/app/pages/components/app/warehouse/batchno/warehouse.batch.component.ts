import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2, ViewContainerRef,
} from '@angular/core';
import {AppTableFlipFormComponent} from '../../components/app.table.flip.form.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../../../abstract.component';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import {
    ACTION_BACK,
    ACTION_DELETE,
    ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';
import WarehouseBatchNo, {IWarehouseBatchNo} from '../../../../../@core/data/warehouse/warehouse.batch.no';
import {
    WarehouseBatchNoDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.batchno/warehouse.batchno.datasource';
import {WarehouseBatchNoToolbarComponent} from './warehouse.batch.toolbar.component';
import {WarehouseBatchNoSmartTableComponent} from './warehouse.batch.table.component';
import {WarehouseBatchNoFormlyComponent} from './warehouse.batch.formly.component';

@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_SETTINGS_BATCH,
    selector: 'ngx-flip-card-app-warehouse-batch-no',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../../flipcard/flipcard.component.scss',
        '../../components/app.flipcard.component.scss',
    ],
})
export class WarehouseBatchNoComponent
    extends AppTableFlipFormComponent<
        IWarehouseBatchNo, WarehouseBatchNoDatasource,
        WarehouseBatchNoToolbarComponent,
        WarehouseBatchNoSmartTableComponent,
        WarehouseBatchNoFormlyComponent> {

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
     * Create a new instance of {WarehouseBatchNoComponent} class
     * @param dataSource {WarehouseBatchNoDatasource}
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
    constructor(@Inject(WarehouseBatchNoDatasource) dataSource: WarehouseBatchNoDatasource,
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
            WarehouseBatchNoToolbarComponent,
            WarehouseBatchNoSmartTableComponent,
            WarehouseBatchNoFormlyComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected onNewData($event: IEvent): void {
        const newInst: IWarehouseBatchNo = new WarehouseBatchNo(null, null, null);
        super.backComponent.setModel(newInst);
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        row && row.getData() && super.backComponent.setModel(row.getData() as IWarehouseBatchNo);
    }
}

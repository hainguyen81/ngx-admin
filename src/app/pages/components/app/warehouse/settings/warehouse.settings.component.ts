import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2, ViewContainerRef,
} from '@angular/core';
import {AppTableFlipFormComponent} from '../../components/app.table.flip.form.component';
import WarehouseSettings, {IWarehouseSetting} from '../../../../../@core/data/warehouse/warehouse.setting';
import {
    WarehouseSettingsDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {WarehouseSettingsSmartTableComponent} from './warehouse.settings.table.component';
import {WarehouseSettingsFormlyComponent} from './warehouse.settings.formly.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../../../abstract.component';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {WarehouseSettingsToolbarComponent} from './warehouse.settings.toolbar.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {
    ACTION_BACK,
    ACTION_DELETE,
    ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
} from '../../../../../config/toolbar.actions.conf';

@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_GENERAL,
    selector: 'ngx-flip-card-app-warehouse-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../../flipcard/flipcard.component.scss',
        '../../components/app.flipcard.component.scss',
    ],
})
export class WarehouseSettingsComponent
    extends AppTableFlipFormComponent<
        IWarehouseSetting, WarehouseSettingsDatasource,
        WarehouseSettingsToolbarComponent,
        WarehouseSettingsSmartTableComponent,
        WarehouseSettingsFormlyComponent> {

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
     * Create a new instance of {WarehouseSettingsComponent} class
     * @param dataSource {WarehouseSettingsDatasource}
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
    constructor(@Inject(WarehouseSettingsDatasource) dataSource: WarehouseSettingsDatasource,
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
            modalDialogService, confirmPopup, lightbox,
            WarehouseSettingsToolbarComponent,
            WarehouseSettingsSmartTableComponent,
            WarehouseSettingsFormlyComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected onNewData($event: IEvent): void {
        const newInst: IWarehouseSetting = new WarehouseSettings(null, null, null);
        super.getBackComponent().setModel(newInst);
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        row && row.getData() && super.getBackComponent().setModel(row.getData() as IWarehouseSetting);
    }
}

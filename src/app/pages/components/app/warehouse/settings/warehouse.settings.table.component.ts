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
import {AppConfig} from '../../../../../config/app.config';
import {IContextMenu} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {API} from '../../../../../config/api.config';
import {
    WarehouseSettingsDatasource,
} from '../../../../../services/implementation/warehouse/warehouse.settings/warehouse.settings.datasource';
import {Constants} from '../../../../../@core/data/constants/warehouse.settings.constants';
import SETTINGS_TYPE = Constants.WarehouseSettingsConstants.SETTINGS_TYPE;
import convertWarehouseSettingsTypeToDisplay =
    Constants.WarehouseSettingsConstants.convertWarehouseSettingsTypeToDisplay;
import {AppSmartTableComponent} from '../../components/app.table.component';
import {ImageCellComponent} from '../../../smart-table/image.cell.component';

/* warehouse settings table settings */
export const WarehouseSettingsTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'warehouse.settings.table.noData',
    actions: {
        add: false,
        edit: false,
        delete: false,
    },
    pager: {
        display: true,
        perPage: AppConfig.COMMON.itemsPerPage,
    },
    columns: {
        code: {
            title: 'warehouse.settings.table.code',
            type: 'string',
            sort: false,
            filter: false,
        },
        name: {
            title: 'warehouse.settings.table.name',
            type: 'string',
            sort: false,
            filter: false,
        },
        type: {
            title: 'warehouse.settings.table.type',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
        image: {
            title: 'warehouse.settings.table.image',
            type: 'string',
            sort: false,
            filter: false,
            renderComponent: ImageCellComponent,
        },
        order: {
            title: 'warehouse.settings.table.order',
            type: 'string',
            sort: false,
            filter: false,
        },
        remark: {
            title: 'warehouse.settings.table.remark',
            type: 'string',
            sort: false,
            filter: false,
        },
    },
};

export const WarehouseSettingsContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: API.warehouseSettings.code,
    selector: 'ngx-smart-table-warehouse-settings',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: [
        '../../../smart-table/smart-table.component.scss',
        './warehouse.settings.table.component.scss',
    ],
})
export class WarehouseSettingsSmartTableComponent extends AppSmartTableComponent<WarehouseSettingsDatasource> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected isShowHeader(): boolean {
        return false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseSettingsSmartTableComponent} class
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
            modalDialogService, confirmPopup, lightbox);
        super.setTableHeader('warehouse.settings.title');
        super.setTableSettings(WarehouseSettingsTableSettings);
        super.setContextMenu(WarehouseSettingsContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
            {field: 'type', search: keyword},
            {field: 'order', search: keyword},
            {field: 'remark', search: keyword},
        ], false);
        this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    /**
     * Convert {SETTINGS_TYPE} to the showed translated value
     * @param value to convert
     * @return converted value
     */
    private convertWarehouseSettingsTypeToDisplay(value: SETTINGS_TYPE): string {
        return this.translate(convertWarehouseSettingsTypeToDisplay(value));
    }

    /**
     * Translate table settings
     */
    protected translateSettings(): void {
        super.translateSettings();

        this.translatedSettings['columns']['type']['valuePrepareFunction'] =
            value => this.convertWarehouseSettingsTypeToDisplay(value);
        this.translatedSettings['columns']['type']['editor']['config']['list'] = [
            {
                value: SETTINGS_TYPE.STATUS,
                title: this.convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.STATUS),
            },
            {
                value: SETTINGS_TYPE.BRAND,
                title: this.convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.BRAND),
            },
            {
                value: SETTINGS_TYPE.SIZE,
                title: this.convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.SIZE),
            },
            {
                value: SETTINGS_TYPE.COLOR,
                title: this.convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.COLOR),
            },
            {
                value: SETTINGS_TYPE.MATERIAL,
                title: this.convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.MATERIAL),
            },
            {
                value: SETTINGS_TYPE.OTHERS,
                title: this.convertWarehouseSettingsTypeToDisplay(SETTINGS_TYPE.OTHERS),
            },
        ];
    }
}

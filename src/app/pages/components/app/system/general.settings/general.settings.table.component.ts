import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
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
import {AppSmartTableComponent} from '../../components/app.table.component';
import {CheckboxCellComponent} from '../../../smart-table/checkbox.cell.component';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {ModuleDatasource} from '../../../../../services/implementation/module.service';
import {throwError} from 'rxjs';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {MODULE_CODES} from '../../../../../config/api.config';
import {isArray, isNullOrUndefined} from 'util';

/* general settings table settings */
export const GeneralSettingsTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'system.general.settings.table.noData',
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
        module_id: {
            title: 'system.general.settings.table.module',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
        code: {
            title: 'system.general.settings.table.code',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        name: {
            title: 'system.general.settings.table.name',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        value: {
            title: 'system.general.settings.table.value',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        builtin: {
            title: 'system.general.settings.table.builtin',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: CheckboxCellComponent,
            editor: {
                type: 'custom',
                component: CheckboxCellComponent,
            },
        },
    },
};

export const GeneralSettingsContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.SYSTEM_SETTINGS,
    selector: 'ngx-smart-table-system-general-settings',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class GeneralSettingsSmartTableComponent
    extends AppSmartTableComponent<GeneralSettingsDatasource> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected isShowHeader(): boolean {
        return false;
    }

    protected get moduleDatasource(): ModuleDatasource {
        return this._moduleDatasource;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {GeneralSettingsSmartTableComponent} class
     * @param dataSource {GeneralSettingsDatasource}
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
    constructor(@Inject(GeneralSettingsDatasource) dataSource: GeneralSettingsDatasource,
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
                @Inject(ModuleDatasource) private _moduleDatasource?: ModuleDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        _moduleDatasource || throwError('Could not inject ModuleDatasource instance');
        super.setTableHeader('system.general.settings.title');
        super.setTableSettings(GeneralSettingsTableSettings);
        super.setContextMenu(GeneralSettingsContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
            {field: 'value', search: keyword},
        ], false);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    protected translateSettings(): void {
        super.translateSettings();

        this.translatedSettings['columns']['module_id']['valuePrepareFunction'] =
            value => this.translateModuleColumn(value);
        SystemDataUtils.invokeAllModelsAsTableSelectOptions(
            this.moduleDatasource, this.getTranslateService()).then(
                options => {
                    this.translatedSettings['columns']['module_id']['editor']['config']['list'] = options;
                    this.getDataSource().refresh();
                });
    }
    private translateModuleColumn(value?: string | null): string {
        const options: { value: string, label: string, title: string }[] =
            this.translatedSettings['columns']['module_id']['editor']['config']['list'];
        if (!isNullOrUndefined(options) && isArray(options)) {
            for (const option of options) {
                if (option.value === value) {
                    return option.label;
                }
            }
        }
        return '';
    }
}

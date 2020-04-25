import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {IContextMenu} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {CheckboxCellComponent} from '../../../smart-table/checkbox.cell.component';
import {Lightbox} from 'ngx-lightbox';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {ImageCellComponent} from '../../../smart-table/image.cell.component';
import {AppSmartTableComponent} from '../../components/app.table.component';
import PromiseUtils from '../../../../../utils/promise.utils';
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {GeneralSettingsDatasource} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {isArray, isNullOrUndefined} from 'util';

/* users table settings */
export const UserTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'system.user.table.noData',
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
        image: {
            title: 'system.user.table.image',
            type: 'custom',
            sort: false,
            filter: false,
            editable: true,
            renderComponent: ImageCellComponent,
            editor: {
                type: 'custom',
                component: ImageCellComponent,
            },
        },
        username: {
            title: 'system.user.table.username',
            type: 'string',
            sort: false,
            filter: false,
            editable: true,
        },
        firstName: {
            title: 'system.user.table.firstName',
            type: 'string',
            sort: false,
            filter: false,
        },
        lastName: {
            title: 'system.user.table.lastName',
            type: 'string',
            sort: false,
            filter: false,
        },
        email: {
            title: 'system.user.table.email',
            type: 'string',
            sort: false,
            filter: false,
        },
        status: {
            title: 'system.user.table.status',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
        enterprise: {
            title: 'system.user.table.enterprise',
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

export const UserContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.SYSTEM_CUSTOMER,
    selector: 'ngx-smart-table-app-system-user',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class UserSmartTableComponent extends AppSmartTableComponent<UserDataSource> {

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
     * Create a new instance of {UserSmartTableComponent} class
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        generalSettingsDatasource || throwError('Could not inject GeneralSettingsDatasource instance');
        super.setTableHeader('system.user.title');
        super.setTableSettings(UserTableSettings);
        super.setContextMenu(UserContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'username', search: keyword},
            {field: 'firstName', search: keyword},
            {field: 'lastName', search: keyword},
            {field: 'email', search: keyword},
        ], false);
        this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    protected translateSettings(): void {
        super.translateSettings();

        this.translatedSettings['columns']['status']['valuePrepareFunction'] =
            value => this.translateColumn('status', value);
        PromiseUtils.parallelPromises(undefined, undefined, [
            this.observeSettingFieldByCode(BUILTIN_CODES.USER_STATUS.code, 'status'),
        ]).then(
            value => {
                this.getLogger().debug('Loading settings successful');
                this.getDataSource().refresh();
            },
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
    /**
     * Observe general setting field by setting code
     * @param settingCode to filter
     * @param column to apply
     */
    private observeSettingFieldByCode(settingCode: string, column: string): Promise<void> {
        return SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsOptions(
            this.generalSettingsDatasource, '__general_settings_index_by_module_code',
            IDBKeyRange.only([MODULE_CODES.SYSTEM, settingCode]),
            this.getTranslateService(), {
                'value': model => model.id,
                'label': model => this.translate(model['value']),
            }).then((settings: { [key: string]: string | string[] | IGeneralSettings; }[]) => {
            this.translatedSettings['columns'][column]['editor']['config']['list'] = settings;
        });
    }
    private translateColumn(column: string, value?: string | null): string {
        const options: { value: string, label: string, title: string }[] =
            this.translatedSettings['columns'][column]['editor']['config']['list'];
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

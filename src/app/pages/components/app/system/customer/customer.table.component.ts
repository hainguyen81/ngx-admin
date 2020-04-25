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
import {CustomerDatasource} from '../../../../../services/implementation/system/customer/customer.datasource';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {IContextMenu} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppSmartTableComponent} from '../../components/app.table.component';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {isArray, isNullOrUndefined} from 'util';
import {GeneralSettingsDatasource} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import {IModel} from '../../../../../@core/data/base';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import BUILTIN_CODES = Constants.COMMON.BUILTIN_CODES;

/* customers table settings */
export const CustomerTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'system.customer.table.noData',
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
            title: 'system.customer.table.code',
            type: 'string',
            sort: false,
            filter: false,
        },
        name: {
            title: 'system.customer.table.name',
            type: 'string',
            sort: false,
            filter: false,
        },
        level: {
            title: 'system.customer.table.level',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
        email: {
            title: 'system.customer.table.email',
            type: 'string',
            sort: false,
            filter: false,
        },
        tel: {
            title: 'system.customer.table.tel',
            type: 'string',
            sort: false,
            filter: false,
        },
        address: {
            title: 'system.customer.table.address',
            type: 'string',
            sort: false,
            filter: false,
        },
        status: {
            title: 'system.customer.table.status',
            type: 'string',
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {list: []},
            },
        },
    },
};

export const CustomerContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    moduleId: MODULE_CODES.SYSTEM.CUSTOMER,
    selector: 'ngx-smart-table-app-system-customer',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class CustomerSmartTableComponent extends AppSmartTableComponent<CustomerDatasource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CustomerSmartTableComponent} class
     * @param dataSource {CustomerDatasource}
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
    constructor(@Inject(CustomerDatasource) dataSource: CustomerDatasource,
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
        super.setTableHeader('system.customer.title');
        super.setTableSettings(CustomerTableSettings);
        super.setContextMenu(CustomerContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            {field: 'code', search: keyword},
            {field: 'name', search: keyword},
            {field: 'email', search: keyword},
            {field: 'title', search: keyword},
            {field: 'tel', search: keyword},
            {field: 'address', search: keyword},
        ], false);
        this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTION
    // -------------------------------------------------

    protected translateSettings(): void {
        super.translateSettings();

        this.translatedSettings['columns']['level']['valuePrepareFunction'] =
            value => this.translateColumn('level', value);
        this.translatedSettings['columns']['status']['valuePrepareFunction'] =
            value => this.translateColumn('status', value);
        SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsTableSelectOptions(
            this.generalSettingsDatasource, 'module_code',
            IDBKeyRange.only(MODULE_CODES.SYSTEM_CUSTOMER), this.getTranslateService()).then(
            options => {
                const levelOptions: { [key: string]: string | string[] | IModel; }[] = [];
                const statusOptions: { [key: string]: string | string[] | IModel; }[] = [];
                (options || []).forEach(option => {
                    switch ((option['model'] || {})['code'] || '') {
                        case BUILTIN_CODES.CUSTOMER_STATUS:
                            statusOptions.push(option);
                            break;
                        case BUILTIN_CODES.CUSTOMER_LEVEL:
                            levelOptions.push(option);
                            break;
                    }
                });
                this.translatedSettings['columns']['status']['editor']['config']['list'] = statusOptions;
                this.translatedSettings['columns']['level']['editor']['config']['list'] = levelOptions;
                this.getDataSource().refresh();
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

import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {CheckboxCellComponent} from '../../../smart-table/checkbox.cell.component';
import {Lightbox} from 'ngx-lightbox';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import {ImageCellComponent} from '../../../smart-table/image.cell.component';
import {AppSmartTableComponent} from '../../components/app.table.component';
import PromiseUtils from '../../../../../utils/promise.utils';
import {GeneralSettingsDatasource} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import {throwError} from 'rxjs';
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import {IContextMenu} from '../../../../../config/context.menu.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {Cell, DefaultEditor} from 'ng2-smart-table';
import {IUser} from '../../../../../@core/data/system/user';
import {SelectTranslateCellComponent} from '../../../smart-table/select.translate.cell.component';
import {Row} from 'ng2-smart-table/lib/data-set/row';

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
            title: 'system.user.table.username',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: ImageCellComponent,
            editor: {
                type: 'custom',
                component: ImageCellComponent,
                config: {
                    'descriptorPrepare': (c: DefaultEditor,
                                          cell: Cell, row: Row,
                                          user: IUser,
                                          config: any) => {
                        return (user ? user.username || '' : '');
                    },
                },
            },
        },
        firstName: {
            title: 'system.user.table.firstName',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        lastName: {
            title: 'system.user.table.lastName',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        email: {
            title: 'system.user.table.email',
            type: 'string',
            sort: false,
            filter: false,
            editable: false,
        },
        status: {
            title: 'system.user.table.status',
            type: 'custom',
            sort: false,
            filter: false,
            editable: false,
            renderComponent: SelectTranslateCellComponent,
            editor: {
                type: 'custom',
                component: SelectTranslateCellComponent,
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
export class UserSmartTableComponent
    extends AppSmartTableComponent<UserDataSource>
    implements OnInit {

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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
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
    }

    ngOnInit(): void {
        super.ngOnInit();

        const settings: any = this.getTableSettings();
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultSystemGeneralSettingsTableColumn(
                this.generalSettingsDatasource, settings, 'status',
                BUILTIN_CODES.STATUS.code, null),
        ]).then(value => {
            this.getLogger().debug('Loading settings successful');
            this.getDataSource().refresh();
        }, reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}

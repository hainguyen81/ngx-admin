import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {convertUserStatusToDisplay, USER_STATUS} from '../../../../../@core/data/user';
import {UserDataSource} from '../../../../../services/implementation/user/user.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {BaseSmartTableComponent} from '../../../smart-table/base.smart-table.component';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {IContextMenu} from '../../../abstract.component';
import {COMMON} from '../../../../../config/common.config';
import {ToastrService} from 'ngx-toastr';

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
            valuePrepareFunction: convertUserStatusToDisplay,
            sort: false,
            filter: false,
            editor: {
                type: 'list',
                config: {
                    list: [
                        {
                            value: USER_STATUS.NOT_ACTIVATED,
                            title: convertUserStatusToDisplay(USER_STATUS.NOT_ACTIVATED),
                        },
                        {
                            value: USER_STATUS.ACTIVATED,
                            title: convertUserStatusToDisplay(USER_STATUS.ACTIVATED),
                        },
                        {
                            value: USER_STATUS.LOCKED,
                            title: convertUserStatusToDisplay(USER_STATUS.LOCKED),
                        },
                    ],
                },
            },
        },
        enterprise: {
            title: 'system.user.table.enterprise',
            type: 'boolean',
            sort: false,
            filter: false,
            editable: false,
            editor: {
                type: 'checkbox',
            },
        },
    },
};

export const UserContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    selector: 'ngx-smart-table',
    templateUrl: '../../../smart-table/smart-table.component.html',
    styleUrls: ['../../../smart-table/smart-table.component.scss'],
})
export class UserSmartTableComponent extends BaseSmartTableComponent<UserDataSource> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {UserSmartTableComponent} class
     * @param dataSource {UserDataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     */
    constructor(@Inject(UserDataSource) dataSource: UserDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
            'system.user.title', UserTableSettings, UserContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([
            { field: 'username', search: keyword },
            { field: 'firstName', search: keyword },
            { field: 'lastName', search: keyword },
            { field: 'email', search: keyword },
        ], false);
        this.getDataSource().refresh();
    }
}

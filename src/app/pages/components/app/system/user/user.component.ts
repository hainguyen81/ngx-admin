import {Component, ComponentFactoryResolver, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {convertUserStatusToDisplay, USER_STATUS} from '../../../../../@core/data/user';
import {UserDataSource} from '../../../../../services/implementation/user/user.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {BaseSmartTableComponent} from '../../../smart-table/base.smart-table.component';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../../config/app.config';
import {
    CONTEXT_MENU_ADD,
    CONTEXT_MENU_DELETE,
    CONTEXT_MENU_EDIT,
    IContextMenu,
} from '../../../abstract.component';

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

export const UserContextMenu: IContextMenu[] = [{
    id: (item?: any) => CONTEXT_MENU_ADD,
    icon: (item?: any) => 'plus-square',
    title: (item?: any) => 'common.contextMenu.add',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}, {
    id: (item?: any) => CONTEXT_MENU_EDIT,
    icon: (item?: any) => 'edit',
    title: (item?: any) => 'common.contextMenu.edit',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}, {
    id: (item?: any) => CONTEXT_MENU_DELETE,
    icon: (item?: any) => 'minus-square',
    title: (item?: any) => 'common.contextMenu.delete',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
}];

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
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     */
    constructor(@Inject(UserDataSource) dataSource: UserDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
        super(dataSource, contextMenuService, logger, renderer, translateService,
            factoryResolver, viewContainerRef,
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

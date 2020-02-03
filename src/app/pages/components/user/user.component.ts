import {IContextMenu, SmartTableComponent} from '../smart-table.component';
import {Component, Inject, Renderer2} from '@angular/core';
import {convertUserStatusToDisplay, USER_STATUS} from '../../../@core/data/user';
import {UserDataSource} from '../../../services/implementation/user/user.datasource';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {
    F2,
    S,
} from '@angular/cdk/keycodes';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import KeyboardUtils from '../../../utils/keyboard.utils';

export const UserTableSettings = {
    hideSubHeader: true,
    noDataMessage: 'Not found any users',
    actions: {
        add: false,
        edit: false,
        delete: false,
    },
    columns: {
        username: {
            title: 'User Name',
            type: 'string',
            sort: false,
            filter: false,
            editable: true,
        },
        firstName: {
            title: 'First Name',
            type: 'string',
            sort: false,
            filter: false,
        },
        lastName: {
            title: 'Last Name',
            type: 'string',
            sort: false,
            filter: false,
        },
        email: {
            title: 'Email',
            type: 'string',
            sort: false,
            filter: false,
        },
        status: {
            title: 'Status',
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
            title: 'Enterprise',
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
    icon: (item?: any) => 'plus-square',
    title: (item?: any) => 'Add',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
    click: (item?: any) => {
        alert('111');
    },
}, {
    icon: (item?: any) => 'edit',
    title: (item?: any) => 'Edit',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
    click: (item?: any) => {
    },
}, {
    icon: (item?: any) => 'minus-square',
    title: (item?: any) => 'Delete',
    enabled: (item?: any) => true,
    visible: (item?: any) => true,
    divider: (item?: any) => false,
    click: (item?: any) => {
        alert('222');
    },
}];

@Component({
    selector: 'ngx-smart-table',
    templateUrl: '../smart-table.component.html',
    styleUrls: ['../smart-table.component.scss'],
})
export class UserSmartTableComponent extends SmartTableComponent {

    constructor(@Inject(UserDataSource) userDataSource: UserDataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(NGXLogger) logger: NGXLogger,
                renderer: Renderer2) {
        super(userDataSource, contextMenuService, logger, renderer);
        super.setTableHeader('Users Management');
        super.setTableSettings(UserTableSettings);
        super.setContextMenu(UserContextMenu);
    }

    onKeyDown(event: KeyboardEvent) {
        super.onKeyDown(event);

        if (!super.getRows().length || KeyboardUtils.isNavigateKey(event)
            || KeyboardUtils.isContextMenuKey(event)) {
            return;
        }

        // detect save action
        let actionRow: Row;
        actionRow = this.getRowByEvent(event);
        let isF2Key: boolean;
        isF2Key = KeyboardUtils.isSpecifiedKey(event, 'F2', F2);
        let isEnterKey: boolean;
        isEnterKey = KeyboardUtils.isEnterKey(event);
        let isEscKey: boolean;
        isEscKey = KeyboardUtils.isEscKey(event);
        let isSKey: boolean;
        isSKey = KeyboardUtils.isSpecifiedKey(event, 'S', 's', S);
        let isDelKey: boolean;
        isDelKey = KeyboardUtils.isDeleteKey(event);
        let isInsertKey: boolean;
        isInsertKey = KeyboardUtils.isInsertKey(event);
        let needToSave: boolean;
        needToSave = ((isF2Key && event.altKey) || (isEnterKey && event.ctrlKey)
            || (isSKey && event.ctrlKey));

        // save row by [ALT + F2] or [CTRL + Enter] or [CTRL + S]
        if (needToSave) {
            this.saveData(actionRow);

            // stop firing event
            this.preventEvent(event);

            // enter edit mode by F2
        } else if (isF2Key) {
            this.enterEditMode(actionRow);

            // stop firing event
            this.preventEvent(event);

            // exit editing mode by Esc
        } else if (isEscKey) {
            this.cancelEditMode(actionRow);

            // close context menu if necessary
            super.closeContextMenu();

            // stop firing event
            this.preventEvent(event);

            // delete row by [DELETE]
        } else if (isDelKey) {
            this.deleteData(actionRow);

            // stop firing event
            this.preventEvent(event);

            // insert new row by [INSERT]
        } else if (isInsertKey) {

        }
        this.getLogger().debug('userComponent - onKeyDown', event);
    }

    /**
     * Enter editing mode
     * @param row to edit. NULL for the first selected row or the first row
     * @param columnIndex to focus
     */
    private enterEditMode(row?: Row, columnIndex?: number) {
        let hoveredRows: NodeListOf<HTMLTableRowElement>;
        hoveredRows = super.getRowElementsBySelector(
            [UserSmartTableComponent.SMART_TABLE_ROW_SELETOR, '.hover'].join(''));
        let editRow: Row;
        editRow = (row ? row : hoveredRows && hoveredRows.length
            ? super.getRowByIndex(hoveredRows.item(0).rowIndex - 1)
            : super.getSelectedRows().length ? super.getSelectedRows().shift()
                : super.getRows().shift());
        if (editRow) {
            super.editCellByIndex(editRow.index, columnIndex);
        }
    }

    /**
     * Exit and cancel editing mode
     * @param row to cancel editing. NULL for all selected editing rows or all editing rows
     */
    private cancelEditMode(row?: Row) {
        let cancelRows: Row[];
        cancelRows = (row ? [row] : super.getSelectedRows().length
            ? super.getSelectedRows() : super.getRows());
        if (cancelRows && cancelRows.length) {
            super.cancelEditRows(cancelRows);
        }
    }

    /**
     * Save current editing data
     * @param row to save. NULL for all selected editing rows or all editing rows
     */
    private saveData(row?: Row) {
        let saveRows: Row[];
        saveRows = (row ? [row] : super.getSelectedRows().length
            ? super.getSelectedRows() : super.getRows());
        if (saveRows && saveRows.length) {
            super.saveRows(saveRows);
        }
    }

    /**
     * Delete the specified row
     * @param row to delete. NULL for the first selected row
     */
    private deleteData(row?: Row) {
        let hoveredRows: NodeListOf<HTMLTableRowElement>;
        hoveredRows = super.getRowElementsBySelector(
            [UserSmartTableComponent.SMART_TABLE_ROW_SELETOR, '.hover'].join(''));
        let delRow: Row;
        delRow = (row ? row : hoveredRows && hoveredRows.length
            ? super.getRowByIndex(hoveredRows.item(0).rowIndex - 1)
            : super.getSelectedRows().length ? super.getSelectedRows().shift() : undefined);
        if (delRow) {
            super.deleteRowByIndex(delRow.index);
        }
    }
}

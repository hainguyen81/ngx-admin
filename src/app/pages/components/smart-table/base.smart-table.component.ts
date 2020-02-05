import {SmartTableComponent} from './smart-table.component';
import {Component, ComponentFactoryResolver, Inject, Renderer2} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {
    F2,
    S,
} from '@angular/cdk/keycodes';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import KeyboardUtils from '../../../utils/keyboard.utils';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {TranslateService} from '@ngx-translate/core';
import {
    CONTEXT_MENU_ADD,
    CONTEXT_MENU_DELETE,
    CONTEXT_MENU_EDIT,
    IContextMenu,
} from '../abstract.component';

/**
 * Base smart table component base on {Ng2SmartTableComponent}
 */
@Component({
    selector: 'ngx-smart-table',
    templateUrl: './smart-table.component.html',
    styleUrls: ['./smart-table.component.scss'],
})
export abstract class BaseSmartTableComponent<T extends DataSource> extends SmartTableComponent {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseSmartTableComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param tableHeader the table caption
     * @param tableSettings the table settings
     * @param contextMenu the context menu items array
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          tableHeader: string, tableSettings: any,
                          contextMenu: IContextMenu[]) {
        super(dataSource, contextMenuService, logger, renderer, translateService, factoryResolver);
        super.setTableHeader(tableHeader || '');
        super.setTableSettings(tableSettings);
        super.setContextMenu(contextMenu || []);
    }

    onKeyDown(event: KeyboardEvent) {
        super.onKeyDown(event);

        if (!super.getRows().length || KeyboardUtils.isNavigateKey(event)
            || KeyboardUtils.isContextMenuKey(event)) {
            return;
        }

        // detect save action
        let actionRow: Row;
        actionRow = super.getRowByEvent(event);
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
            super.preventEvent(event);

            // enter edit mode by F2
        } else if (isF2Key) {
            this.enterEditMode(actionRow);

            // stop firing event
            super.preventEvent(event);

            // exit editing mode by Esc
        } else if (isEscKey) {
            this.cancelEditMode(actionRow);

            // close context menu if necessary
            super.closeContextMenu();

            // stop firing event
            super.preventEvent(event);

            // delete row by [DELETE]
        } else if (isDelKey) {
            this.deleteData(actionRow);

            // stop firing event
            super.preventEvent(event);

            // insert new row by [INSERT]
        } else if (isInsertKey) {
            super.newRow();

            // stop firing event
            super.preventEvent(event);
        }
        super.getLogger().debug('userComponent - onKeyDown', event);
    }

    /**
     * Enter editing mode
     * @param row to edit. NULL for the first selected row or the first row
     * @param columnIndex to focus
     */
    private enterEditMode(row?: Row, columnIndex?: number) {
        let hoveredRows: NodeListOf<HTMLTableRowElement>;
        hoveredRows = super.getRowElementsBySelector(
            [SmartTableComponent.SMART_TABLE_ROW_SELETOR, '.hover'].join(''));
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
            cancelRows.forEach(r => {
                let rowData: any;
                rowData = r.getData();
                // delete row if empty identity
                if (this.isRedundantRowData(rowData)) {
                    this.deleteData(r);
                }
            });
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
            [SmartTableComponent.SMART_TABLE_ROW_SELETOR, '.hover'].join(''));
        let delRow: Row;
        delRow = (row ? row : hoveredRows && hoveredRows.length
            ? super.getRowByIndex(hoveredRows.item(0).rowIndex - 1)
            : super.getSelectedRows().length ? super.getSelectedRows().shift() : undefined);
        if (delRow) {
            super.deleteRowByIndex(delRow.index);
        }
    }

    /**
     * Get a boolean value indicating the specified row data whether is empty (not identity)
     * to delete permanently when pressing ESC to exit editing mode
     * @param data to check. default checking on `id` property
     */
    protected isRedundantRowData(data?: any) {
        return (!data || !(data['id'] || '').length);
    }

    onMenuEvent(event, menuItem?: IContextMenu) {
        let mnuId: string;
        mnuId = (menuItem ? menuItem.id.apply(this, [ event.item ]) : '');
        switch (mnuId) {
            case CONTEXT_MENU_ADD:
                this.newRow();
                break;
            case CONTEXT_MENU_EDIT:
                this.editRowByData(event.item, 'id');
                break;
            case CONTEXT_MENU_DELETE:
                this.deleteRowByData(event.item, 'id');
                break;
        }
    }

    onSearch(keyword?: any): void {
        if (!(keyword || '').length) {
            this.getDataSource().setFilter(null, false);
            this.getDataSource().refresh();
            return;
        }

        this.doSearch(keyword);
    }

    abstract doSearch(keyword: any): void;
}

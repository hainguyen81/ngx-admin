import {SmartTableComponent} from './smart-table.component';
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {F2, S} from '@angular/cdk/keycodes';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import KeyboardUtils from '../../../utils/keyboard.utils';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {TranslateService} from '@ngx-translate/core';
import {CONTEXT_MENU_ADD, CONTEXT_MENU_DELETE, CONTEXT_MENU_EDIT, IContextMenu, IEvent} from '../abstract.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';

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
     * @param toasterService {ToasterService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param tableHeader the table caption
     * @param tableSettings the table settings
     * @param contextMenu the context menu items array
     */
    protected constructor(@Inject(DataSource) dataSource: T,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(ToastrService) toasterService: ToastrService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                          @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                          @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                          tableHeader?: string, tableSettings?: any,
                          contextMenu?: IContextMenu[]) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
            modalDialogService, confirmPopup);
        this.setTableHeader(tableHeader || '');
        this.setTableSettings(tableSettings);
        this.setContextMenu(contextMenu || []);
    }

    /**
     * Perform keydown action (not navigate and context menu key
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onActionKeyDown(event: IEvent): void {
        super.onActionKeyDown(event);

        if (!super.getRows().length) {
            return;
        }

        // detect save action
        let kbEvent: KeyboardEvent;
        kbEvent = event.$event as KeyboardEvent;
        let actionRow: Row;
        actionRow = super.getRowByEvent(kbEvent);
        let isF2Key: boolean;
        isF2Key = KeyboardUtils.isSpecifiedKey(kbEvent, 'F2', F2);
        let isEnterKey: boolean;
        isEnterKey = KeyboardUtils.isEnterKey(kbEvent);
        let isEscKey: boolean;
        isEscKey = KeyboardUtils.isEscKey(kbEvent);
        let isSKey: boolean;
        isSKey = KeyboardUtils.isSpecifiedKey(kbEvent, 'S', 's', S);
        let isDelKey: boolean;
        isDelKey = KeyboardUtils.isDeleteKey(kbEvent);
        let isInsertKey: boolean;
        isInsertKey = KeyboardUtils.isInsertKey(kbEvent);
        let needToSave: boolean;
        needToSave = ((isF2Key && kbEvent.altKey) || (isEnterKey && kbEvent.ctrlKey)
            || (isSKey && kbEvent.ctrlKey));

        // save row by [ALT + F2] or [CTRL + Enter] or [CTRL + S]
        if (needToSave) {
            this.saveData(actionRow);

            // stop firing event
            super.preventEvent(event.$event);

            // enter edit mode by F2
        } else if (isF2Key) {
            this.enterEditMode(actionRow);

            // stop firing event
            super.preventEvent(event.$event);

            // exit editing mode by Esc
        } else if (isEscKey) {
            this.cancelEditMode(actionRow);

            // close context menu if necessary
            super.closeContextMenu();

            // stop firing event
            super.preventEvent(event.$event);

            // delete row by [DELETE]
        } else if (isDelKey) {
            this.deleteData(actionRow);

            // stop firing event
            super.preventEvent(event.$event);

            // insert new row by [INSERT]
        } else if (isInsertKey) {
            super.newRow();

            // stop firing event
            super.preventEvent(event.$event);
        }
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

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Perform action on menu item
     * @param event {IEvent} that contains {$data} as Object, consist of:
     *      menu: menu item
     *      item: menu item data
     * and {$event} as action event
     * @param menuId menu item identity
     * @param data menu data
     */
    protected doMenuAction(event: IEvent, menuId?: string | null, data?: any | null) {
        switch (menuId || '') {
            case CONTEXT_MENU_ADD:
                this.newRow();
                break;
            case CONTEXT_MENU_EDIT:
                this.editRowByData(event.$data['item'], 'id');
                break;
            case CONTEXT_MENU_DELETE:
                this.deleteRowByData(event.$data['item'], 'id');
                break;
        }
    }
}

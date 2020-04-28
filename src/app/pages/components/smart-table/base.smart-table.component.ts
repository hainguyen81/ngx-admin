import {SmartTableComponent} from './smart-table.component';
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
import {F2, S} from '@angular/cdk/keycodes';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import KeyboardUtils from '../../../utils/keyboard.utils';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../abstract.component';
import {
    CONTEXT_MENU_ADD,
    CONTEXT_MENU_DELETE,
    CONTEXT_MENU_EDIT,
} from '../../../config/context.menu.conf';

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
    protected constructor(@Inject(DataSource) dataSource: T,
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
    }

    /**
     * Perform keydown action (not navigate and context menu key
     * @param event {IEvent} that contains {$event} as KeyboardEvent
     */
    onActionKeyDown(event: IEvent): void {
        super.onActionKeyDown(event);

        // detect save action
        let kbEvent: KeyboardEvent;
        kbEvent = event.event as KeyboardEvent;
        let actionRow: Row;
        actionRow = this.getRowByEvent(kbEvent);
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

        if (!this.getRows().length && !isInsertKey) {
            return;
        }

        // save row by [ALT + F2] or [CTRL + Enter] or [CTRL + S]
        if (needToSave) {
            this.saveData(actionRow);

            // stop firing event
            this.preventEvent(event.event as Event);

            // enter edit mode by F2
        } else if (isF2Key) {
            this.enterEditMode(actionRow);

            // stop firing event
            this.preventEvent(event.event as Event);

            // exit editing mode by Esc
        } else if (isEscKey) {
            this.cancelEditMode(actionRow);

            // close context menu if necessary
            this.closeContextMenu();

            // stop firing event
            this.preventEvent(event.event as Event);

            // delete row by [DELETE]
        } else if (isDelKey) {
            this.deleteData(actionRow);

            // stop firing event
            this.preventEvent(event.event as Event);

            // insert new row by [INSERT]
        } else if (isInsertKey) {
            this.newRow();

            // stop firing event
            this.preventEvent(event.event as Event);
        }
    }

    /**
     * Enter editing mode
     * @param row to edit. NULL for the first selected row or the first row
     * @param columnIndex to focus
     */
    private enterEditMode(row?: Row, columnIndex?: number) {
        let hoveredRows: NodeListOf<HTMLTableRowElement>;
        hoveredRows = this.getRowElementsBySelector(
            [SmartTableComponent.SMART_TABLE_ROW_SELETOR, '.hover'].join(''));
        let editRow: Row;
        editRow = (row ? row : hoveredRows && hoveredRows.length
            ? this.getRowByIndex(hoveredRows.item(0).rowIndex - 1)
            : this.getSelectedRows().length ? this.getSelectedRows().shift()
                : this.getRows().shift());
        if (editRow) {
            this.editCellByIndex(editRow.index, columnIndex);
        }
    }

    /**
     * Exit and cancel editing mode
     * @param row to cancel editing. NULL for all selected editing rows or all editing rows
     */
    private cancelEditMode(row?: Row) {
        let cancelRows: Row[];
        cancelRows = (row ? [row] : this.getSelectedRows().length
            ? this.getSelectedRows() : this.getRows());
        if (cancelRows && cancelRows.length) {
            this.cancelEditRows(cancelRows);
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
        saveRows = (row ? [row] : this.getSelectedRows().length
            ? this.getSelectedRows() : this.getRows());
        if (saveRows && saveRows.length) {
            this.saveRows(saveRows);
        }
    }

    /**
     * Delete the specified row
     * @param row to delete. NULL for the first selected row
     */
    private deleteData(row?: Row) {
        let hoveredRows: NodeListOf<HTMLTableRowElement>;
        hoveredRows = this.getRowElementsBySelector(
            [SmartTableComponent.SMART_TABLE_ROW_SELETOR, '.hover'].join(''));
        let delRow: Row;
        delRow = (row ? row : hoveredRows && hoveredRows.length
            ? this.getRowByIndex(hoveredRows.item(0).rowIndex - 1)
            : this.getSelectedRows().length ? this.getSelectedRows().shift() : undefined);
        if (delRow) {
            this.deleteRowByIndex(delRow.index);
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
                this.editRowByData(event.data['item'], 'id');
                break;
            case CONTEXT_MENU_DELETE:
                this.deleteRowByData(event.data['item'], 'id');
                break;
        }
    }
}

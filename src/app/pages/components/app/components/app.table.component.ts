import {COMMON} from '../../../../config/common.config';
import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef,} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {BaseSmartTableComponent} from '../../smart-table/base.smart-table.component';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {ConfirmPopup} from 'ngx-material-popup';
import {TranslateService} from '@ngx-translate/core';
import {DataSource, Row} from '@app/types/index';
import {IModel} from '../../../../@core/data/base';
import {CONTEXT_MENU_DELETE, CONTEXT_MENU_EDIT, IContextMenu,} from '../../../../config/context.menu.conf';
import {IEvent} from '../../abstract.component';
import {ActivatedRoute, Router} from '@angular/router';

export const AppCommonContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    selector: 'ngx-smart-table-app',
    templateUrl: '../../smart-table/smart-table.component.html',
    styleUrls: ['../../smart-table/smart-table.component.scss'],
})
export class AppSmartTableComponent<D extends DataSource> extends BaseSmartTableComponent<D> {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    // raise while insert new table row
    private newItemDelegate: (event: IEvent) => void;
    // raise while editing table row
    private editItemDelegate: (event: IEvent) => void;
    // raise while editing table row
    private deleteItemDelegate: (event: IEvent) => void;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Set the item new listener
     * @param newItemDelegate listener
     */
    public setNewItemListener(newItemDelegate: (event: IEvent) => void) {
        this.newItemDelegate = newItemDelegate;
    }

    /**
     * Set the item editing listener
     * @param editItemDelegate listener
     */
    public setEditItemListener(editItemDelegate: (event: IEvent) => void) {
        this.editItemDelegate = editItemDelegate;
    }

    /**
     * Set the item deleting listener
     * @param deleteItemDelegate listener
     */
    public setDeleteItemListener(deleteItemDelegate: (event: IEvent) => void) {
        this.deleteItemDelegate = deleteItemDelegate;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppSmartTableComponent} class
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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     */
    constructor(@Inject(DataSource) dataSource: D,
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.setContextMenu(AppCommonContextMenu);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        // this.getDataSource().setFilter([], false);
        // this.getDataSource().refresh();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create new Row
     */
    protected newRow() {
        if (this.newItemDelegate && !this.isInEditMode) {
            this.newItemDelegate.apply(this, [{}]);

        } else {
            super.newRow();
        }
    }

    /**
     * Put the specified Cell into editing mode.
     * It means whole Row will be in editing mode.
     * @param rowIndex to edit
     * @param columnIndex to edit. -1 for focus the first cell
     */
    protected editCellByIndex(rowIndex: number, columnIndex: number) {
        if (0 > rowIndex || -1 > columnIndex) {
            return;
        }

        let row: Row;
        row = this.getRowByIndex(rowIndex);
        if (!row || row.isInEditing || !row.cells || !row.cells.length
            || columnIndex >= row.cells.length) {
            return;
        }

        if (this.editItemDelegate) {
            this.editItemDelegate.apply(this,
                [{data: {rowIndex: rowIndex, columnIndex: columnIndex, row: row}}]);
        } else {
            super.editCellByIndex(rowIndex, columnIndex);
        }
    }

    /**
     * Delete the specified Row
     * @param row to delete
     */
    protected deleteRow(row: Row) {
        if (row && this.deleteItemDelegate) {
            this.deleteItemDelegate.apply(this,
                [{data: {rowIndex: row.index, columnIndex: 0, row: row}}]);
        } else {
            super.deleteRow(row);
        }
    }

    protected showHideContextMenu(event?: Event, target?: Element | EventTarget, data?: any): boolean {
        const contextMenuItems: IContextMenu[] = this.getContextMenu() || [];
        contextMenuItems.forEach(contextMenu => {
            switch (contextMenu.id) {
                case CONTEXT_MENU_DELETE:
                case CONTEXT_MENU_EDIT: {
                    contextMenu.enabled = ((<IModel>data) && ((<IModel>data).id || '').length > 0);
                    break;
                }
            }
        });
        return super.showHideContextMenu(event, target, data);
    }
}

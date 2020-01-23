import {Component} from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {throwError} from 'rxjs';
import {MouseEventGuard} from './customization/mouse.event.guard';

@Component({
    selector: 'ngx-smart-table',
    templateUrl: './smart-table.component.html',
    styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent {

    private tableHeader: string;
    private settings = {
        add: {
            addButtonContent: '<i class="nb-plus"></i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
        },
        columns: {
            id: {
                title: 'ID',
                type: 'number',
            },
            firstName: {
                title: 'First Name',
                type: 'string',
            },
            lastName: {
                title: 'Last Name',
                type: 'string',
            },
            username: {
                title: 'Username',
                type: 'string',
            },
            email: {
                title: 'E-mail',
                type: 'string',
            },
            age: {
                title: 'Age',
                type: 'number',
            },
        },
    };

    private dataSource: DataSource = new LocalDataSource();

    constructor() {
    }

    protected setTableSettings(settings: any) {
        this.settings = settings;
    }

    protected setTableHeader(header: string) {
        this.tableHeader = header;
    }

    protected setDataSource(dataSource: DataSource) {
        this.dataSource = dataSource;
        if (!dataSource) {
            throwError('Not found data source!');
        }
    }

    /**
     * Triggered once a row is selected (either clicked or selected automatically
     * (after page is changed, after some row is deleted, etc)).
     * @param event Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onRowSelect(event): void {
        // TODO Waiting for implementing from children component
    }

    /**
     * Triggered only on a user click event.
     * @param event Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onUserRowSelect(event): void {
        // TODO Waiting for implementing from children component
        if (MouseEventGuard.isDoubleClick()) {
            this.onDoubleClick(event);
        }
    }

    /**
     * Triggered only on a user double-click event from onUserRowSelect.
     * @param event Object, consist of:
     *      data: Object - selected row data object
     *      source: DataSource - table data source
     */
    onDoubleClick(event): void {
        // TODO Waiting for implementing from children component
    }

    /**
     * Triggered only on a user mouseover event.
     * @param event Object, consist of:
     *      data: Object - highlighted row data object
     *      source: DataSource - table data source
     */
    onMouseOver(event): void {
        // TODO Waiting for implementing from children component
    }

    /**
     * Triggered once a Create button clicked.
     * Triggered only if table mode = external.
     * @param event Object, consist of:
     *      source: DataSource - table data source
     */
    onCreate(event): void {
        // TODO Waiting for implementing from children component
    }

    /**
     * Triggered once a Create button clicked.
     * Triggered only if table confirmCreate = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event Object, consist of:
     *      newData: Object - data entered in a new row
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods.
     */
    onCreateConfirm(event): void {
        // TODO Waiting for implementing from children component
    }

    /**
     * Triggered once an Edit button clicked on a row.
     * Triggered only if table mode = external.
     * @param event Object, consist of:
     *      data: Object - row data object
     *      source: DataSource - table data source
     */
    onEdit(event): void {
        // TODO Waiting for implementing from children component
    }

    /**
     * Triggered once a Save button clicked.
     * Triggered only if table confirmSave = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event Object, consist of:
     *      data: Object - original row data
     *      newData: Object - edited data
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve(newData: Object) and reject() methods.
     */
    onEditConfirm(event): void {
        // TODO Waiting for implementing from children component
    }

    /**
     * Triggered once a Delete button clicked on a row.
     * Triggered only if table mode = external.
     * @param event Object, consist of:
     *      data: Object - row data object
     *      source: DataSource - table data source
     */
    onDelete(event): void {
        // TODO Waiting for implementing from children component
    }

    /**
     * Triggered once a Delete button clicked.
     * Triggered only if table confirmDelete = true and mode = inline.
     * Allows you to confirm changes before they are applied to the table data source.
     * @param event Object, consist of:
     *      data: Object - data object to delete
     *      source: DataSource - table data source
     *      confirm: Deferred - Deferred object with resolve() and reject() methods.
     */
    onDeleteConfirm(event): void {
        // TODO Waiting for implementing from children component
    }
}

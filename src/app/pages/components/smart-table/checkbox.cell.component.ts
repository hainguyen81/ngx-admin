import {Component} from '@angular/core';
import {DefaultEditor} from 'ng2-smart-table';

/**
 * Smart table checkbox cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-checkbox-cell',
    templateUrl: './checkbox.cell.component.html',
    styleUrls: ['./checkbox.cell.component.scss'],
})
export class CheckboxCellComponent extends DefaultEditor {
    private value?: boolean | false;
    private rowData?: any | null;
}

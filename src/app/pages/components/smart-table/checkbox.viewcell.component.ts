import {ViewCellComponent} from 'ng2-smart-table/components/cell/cell-view-mode/view-cell.component';
import {Component} from '@angular/core';

/**
 * Smart table checkbox cell component for view mode base on {ViewCellComponent}
 */
@Component({
    selector: 'ngx-smart-table-checkbox-view',
    templateUrl: './checkbox.viewcell.component.html',
    styleUrls: ['./checkbox.viewcell.component.scss'],
})
export class CheckboxViewcellComponent extends ViewCellComponent {
    private value?: boolean | false;
    private rowData?: any | null;
}

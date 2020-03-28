import {Component} from '@angular/core';
import {DefaultEditor} from 'ng2-smart-table';

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends DefaultEditor {
    value?: boolean | false;
}

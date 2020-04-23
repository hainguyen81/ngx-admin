import {Component, Inject} from '@angular/core';
import {DefaultEditor} from 'ng2-smart-table';
import {isArray} from 'util';

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends DefaultEditor {
    value?: string[] | string | null;

    private getValue(): any {
        return (this.cell && isArray(this.cell.getValue()) ? Array.from(this.cell.getValue())
            : this.cell && this.cell.getValue() ? [ this.cell.getValue() ]
                : this.value && isArray(this.value) ? Array.from(this.value)
                    : this.value ? [ this.value ] : []);
    }

    public getImages(): string[] {
        return this.getValue() as string[];
    }
}

import {Component, Host} from '@angular/core';
import {Cell, DefaultEditor, ViewCell} from 'ng2-smart-table';
import {isArray} from 'util';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {Column} from 'ng2-smart-table/lib/data-set/column';

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends DefaultEditor {

    private static DESCRIPTOR_PREPARE: string = 'descriptorPrepare';

    value?: string[] | string | null;

    constructor(@Host() private parentView: CustomViewComponent) {
        super();
    }

    private getValue(): any {
        return (this.cell && isArray(this.cell.getValue()) ? Array.from(this.cell.getValue())
            : this.cell && this.cell.getValue() ? [ this.cell.getValue() ]
                : this.value && isArray(this.value) ? Array.from(this.value)
                    : this.value ? [ this.value ] : []);
    }

    public getImages(): string[] {
        return this.getValue() as string[];
    }

    protected getCell(): Cell {
        if (this.cell) return this.cell;
        if (this.parentView) return this.parentView.cell;
        return undefined;
    }

    /**
     * Get the image component descriptor
     * @return the image component descriptor
     */
    public getDescriptor(): string {
        let descriptor: string = '';
        const cell: Cell = this.getCell();
        const column: Column = (cell ? cell.getColumn() : undefined);
        if (column && column.getConfig()) {
            const columnConfig: any = column.getConfig();
            if (columnConfig.hasOwnProperty(ImageCellComponent.DESCRIPTOR_PREPARE)) {
                if (typeof columnConfig[ImageCellComponent.DESCRIPTOR_PREPARE] === 'function') {
                    descriptor = columnConfig[ImageCellComponent.DESCRIPTOR_PREPARE]
                        .call(undefined, cell, cell.getRow().getData());
                } else {
                    descriptor = columnConfig[ImageCellComponent.DESCRIPTOR_PREPARE] || '';
                }
            }
        }
        return descriptor;
    }
}

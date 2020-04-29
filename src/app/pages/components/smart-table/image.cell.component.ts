import {Component} from '@angular/core';
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

    private static DESCRIPTOR_PREPARE: string = 'descriptorPrepare';

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

    /**
     * Get the image component descriptor
     * @return the image component descriptor
     */
    public getDescriptor(): string {
        let descriptor: string = '';
        if (this.cell && this.cell.getColumn() && this.cell.getColumn().getConfig()) {
            const columnConfig: any = this.cell.getColumn().getConfig();
            if (columnConfig.hasOwnProperty(ImageCellComponent.DESCRIPTOR_PREPARE)) {
                if (typeof columnConfig[ImageCellComponent.DESCRIPTOR_PREPARE] === 'function') {
                    descriptor = columnConfig[ImageCellComponent.DESCRIPTOR_PREPARE].call(undefined,
                        [this.cell, this.cell.getRow().getData()]);
                } else {
                    descriptor = columnConfig[ImageCellComponent.DESCRIPTOR_PREPARE] || '';
                }
            }
        }
        return descriptor;
    }
}

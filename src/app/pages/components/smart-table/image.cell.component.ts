import {Component, Host, Inject, Renderer2} from '@angular/core';
import {Cell} from 'ng2-smart-table';
import {isArray} from 'util';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends AbstractCellEditor {

    private static DESCRIPTOR_PREPARE: string = 'descriptorPrepare';

    get images(): string[] {
        if (isArray(super.cellValue)) {
            return Array.from(super.cellValue) as string[];
        } else if (super.cellValue) {
            return [super.cellValue] as string[];
        }
        return [];
    }

    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_parentView, _translateService, _renderer, _logger);
    }

    /**
     * Get the image component descriptor
     * @return the image component descriptor
     */
    public getDescriptor(): string {
        let descriptor: string = '';
        const cell: Cell = this.cell;
        const config: any = this.cellColumnConfig;
        if (config && Object.keys(config).length
            && config.hasOwnProperty(ImageCellComponent.DESCRIPTOR_PREPARE)) {
            if (typeof config[ImageCellComponent.DESCRIPTOR_PREPARE] === 'function') {
                descriptor = config[ImageCellComponent.DESCRIPTOR_PREPARE]
                    .call(undefined, cell, this.cellRow, this.cellRowData);
            } else {
                descriptor = config[ImageCellComponent.DESCRIPTOR_PREPARE] || '';
            }
        }
        return descriptor;
    }
}

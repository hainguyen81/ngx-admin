import {Component, Host, Inject, Renderer2} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Cell} from 'ng2-smart-table';
import {Column} from 'ng2-smart-table/lib/data-set/column';

/**
 * Smart table checkbox cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-html-cell',
    templateUrl: './html.cell.component.html',
    styleUrls: ['./html.cell.component.scss'],
})
export class HtmlCellComponent extends AbstractCellEditor {

    private static HTML_VALUE_PREPARE_FUNCTION: string = 'htmlValuePrepare';

    get isEditable(): boolean {
        return false;
    }

    get cellValue(): any {
        let htmlValue: string = '';
        const cell: Cell = this.cell;
        const config: any = this.cellColumnConfig;
        const column: Column = this.cellColumn;
        if (column && Object.keys(column).length
            && column.hasOwnProperty(HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION)) {
            if (typeof column[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION] === 'function') {
                htmlValue = column[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION]
                    .call(undefined, cell, this.cellRow, this.cellRowData);
            } else {
                htmlValue = column[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION] || '';
            }

        } else if (config && Object.keys(config).length
            && config.hasOwnProperty(HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION)) {
            if (typeof config[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION] === 'function') {
                htmlValue = config[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION]
                    .call(undefined, cell, this.cellRow, this.cellRowData);
            } else {
                htmlValue = config[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION] || '';
            }
        }
        return htmlValue;
    }

    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_parentView, _translateService, _renderer, _logger);
    }
}

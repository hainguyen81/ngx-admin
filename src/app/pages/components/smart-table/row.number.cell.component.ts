import {Component, Host, Inject, Renderer2} from '@angular/core';
import {NumberCellComponent} from './number.cell.component';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Smart table row number cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-row-number-cell',
    templateUrl: './number.cell.component.html',
    styleUrls: ['./number.cell.component.scss'],
})
export class RowNumberCellComponent extends NumberCellComponent {

    get isEditable(): boolean {
        return false;
    }

    get cellValue(): number {
        return (this.cellRow ? this.cellRow.index + 1 : 1);
    }

    get isCurrency(): boolean {
        return false;
    }

    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_parentView, _translateService, _renderer, _logger);
    }
}

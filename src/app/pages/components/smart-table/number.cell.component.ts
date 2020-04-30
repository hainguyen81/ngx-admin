import {Component, Host, Inject, Renderer2} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Smart table number cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-number-cell',
    templateUrl: './number.cell.component.html',
    styleUrls: ['./number.cell.component.scss'],
})
export class NumberCellComponent extends AbstractCellEditor {

    get cellValue(): number {
        return super.cellValue as number;
    }

    get isCurrency(): boolean {
        return (this.cellColumnConfig && (this.cellColumnConfig['isCurrency'] || false));
    }

    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_parentView, _translateService, _renderer, _logger);
    }
}

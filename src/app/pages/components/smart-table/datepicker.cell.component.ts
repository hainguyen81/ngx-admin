import {Component, Host, Inject, Renderer2} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Smart table date-picker cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-date-picker-cell',
    templateUrl: './datepicker.cell.component.html',
    styleUrls: ['./datepicker.cell.component.scss'],
})
export class DatePickerCellComponent extends AbstractCellEditor {

    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_parentView, _translateService, _renderer, _logger);
    }
}

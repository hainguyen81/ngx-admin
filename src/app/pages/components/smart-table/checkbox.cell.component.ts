import {Component, Host, Inject, Renderer2} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Smart table checkbox cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-checkbox-cell',
    templateUrl: './checkbox.cell.component.html',
    styleUrls: ['./checkbox.cell.component.scss'],
})
export class CheckboxCellComponent extends AbstractCellEditor {

    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_parentView, _translateService, _renderer, _logger);
    }
}

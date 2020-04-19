import {Component, Inject, Renderer2} from '@angular/core';
import {IModel} from '../../../../@core/data/base';
import {SelectExFormFieldComponent} from '../../formly/formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Custom formly field for selecting parent
 */
@Component({
    selector: 'ngx-select-ex-app',
    templateUrl: '../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../formly/formly.select.ex.field.component.scss'],
})
export abstract class AppFormlySelectExFieldComponent<T extends IModel>
    extends SelectExFormFieldComponent {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlyTreeviewDropdownFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     */
    protected constructor(@Inject(TranslateService) _translateService: TranslateService,
                          @Inject(Renderer2) _renderer: Renderer2,
                          @Inject(NGXLogger) _logger: NGXLogger) {
        super(_translateService, _renderer, _logger);
    }
}

import {Component, Inject} from '@angular/core';
import {IModel} from '../../../../@core/data/base';
import {SelectExFormFieldComponent} from '../../formly/formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';

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
     * @param translateService {TranslateService}
     */
    protected constructor(@Inject(TranslateService) _translateService: TranslateService) {
        super(_translateService);
    }
}

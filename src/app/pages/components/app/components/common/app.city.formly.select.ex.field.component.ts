import {Component, Inject} from '@angular/core';
import {AppFormlySelectExFieldComponent} from '../../components/app.formly.select.ex.field.component';
import {ICity} from '../../../../../@core/data/system/city';
import {TranslateService} from '@ngx-translate/core';

/**
 * Custom city formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-city',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppCityFormlySelectExFieldComponent
    extends AppFormlySelectExFieldComponent<ICity> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlyTreeviewDropdownFieldComponent} class
     * @param translateService {TranslateService}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService) {
        super(_translateService);
    }
}

import {DropdownTreeviewFormFieldComponent} from '../../formly/formly.treeview.dropdown.field.component';
import {TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {AfterViewInit, Component, Inject, Renderer2} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import ObjectUtils from '../../../../utils/object.utils';
import {TOKEN_APP_TREEVIEW_SHOW_ALL, AppTreeviewI18n} from '../components/app.treeview.i18n';
import {IModel} from '../../../../@core/data/base';
import {NGXLogger} from 'ngx-logger';

/**
 * Custom formly field for selecting special
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown-app',
    templateUrl: '../../formly/formly.treeview.dropdown.field.component.html',
    styleUrls: ['../../formly/formly.treeview.dropdown.field.component.scss'],
    providers: [
        {
            provide: TOKEN_APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: AppTreeviewI18n,
            deps: [TranslateService, TOKEN_APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export abstract class AppFormlyTreeviewDropdownFieldComponent<T extends IModel>
    extends DropdownTreeviewFormFieldComponent
    implements AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get isEnabledItemImage(): boolean {
        return true;
    }

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

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.getTreeviewComponent()
        && this.getTreeviewComponent().setEnabledItemImage(this.isEnabledItemImage);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Disable the treeview item by the specified organization
     * @param value to disable
     */
    public disableItemsByValue(value?: T | null): void {
        let item: TreeviewItem;
        item = (value && value.id ? this.valueFormatter(value.id) : null);
        item && this.disableItems(item);
    }

    protected valueFormatter(value: any): TreeviewItem {
        return this.filterValueTreeItem(value, 'id');
    }

    protected valueParser(value?: any): any {
        let itValue: TreeviewItem;
        itValue = ObjectUtils.cast(value, TreeviewItem);
        return (itValue && itValue.value ? itValue.value['id'] : (value || {})['id']);
    }
}

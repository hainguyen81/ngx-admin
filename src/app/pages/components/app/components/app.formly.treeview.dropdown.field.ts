import {DropdownTreeviewFormFieldComponent} from '../../formly/formly.treeview.dropdown.field';
import {TreeviewI18n, TreeviewItem} from 'ngx-treeview';
import {AfterViewInit, Component, Inject, Injectable, InjectionToken, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import ObjectUtils from '../../../../utils/object.utils';
import {APP_TREEVIEW_SHOW_ALL, AppTreeviewI18n} from '../components/app.treeview.i18n';
import {IModel} from '../../../../@core/data/base';

/**
 * Custom warehouse category formly field for selecting parent category
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown-app',
    templateUrl: '../../formly/formly.treeview.dropdown.field.html',
    styleUrls: ['../../formly/formly.treeview.dropdown.field.scss'],
    providers: [
        {
            provide: APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: AppTreeviewI18n,
            deps: [TranslateService, APP_TREEVIEW_SHOW_ALL],
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
     * @param translateService {TranslateService}
     */
    protected constructor(@Inject(TranslateService) _translateService: TranslateService) {
        super(_translateService);
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

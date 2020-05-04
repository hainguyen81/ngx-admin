import {
    AfterViewInit,
    Component, Inject, Input,
    QueryList, Renderer2,
    ViewChildren,
} from '@angular/core';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeviewItem} from 'ngx-treeview';
import ComponentUtils from '../../../utils/component.utils';
import {IEvent} from '../abstract.component';
import {NgxDropdownTreeviewComponent} from '../treeview/treeview.dropdown.component';
import {isArray, isNullOrUndefined} from 'util';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {isObservable, Observable} from 'rxjs';

/**
 * Formly Treeview Dropdown field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown',
    templateUrl: './formly.treeview.dropdown.field.component.html',
    styleUrls: ['./formly.treeview.dropdown.field.component.scss'],
})
export class DropdownTreeviewFormFieldComponent extends AbstractFieldType implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    /* tree-view config */
    @Input('config') private treeviewConfig: TreeviewConfig;
    /* tree-view items array */
    @Input('items') private treeviewItems: TreeviewItem[];

    @ViewChildren(NgxDropdownTreeviewComponent)
    private readonly queryNgxTreeviewComponent: QueryList<NgxDropdownTreeviewComponent>;
    private ngxTreeviewComponent: NgxDropdownTreeviewComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgxDropdownTreeviewComponent} instance
     * @return the {NgxDropdownTreeviewComponent} instance
     */
    protected getTreeviewComponent(): NgxDropdownTreeviewComponent {
        return this.ngxTreeviewComponent;
    }

    /**
     * Get the {TreeviewConfig} instance
     * @return the {TreeviewConfig} instance
     */
    public getConfig(): TreeviewConfig {
        return this.treeviewConfig;
    }

    /**
     * Set the {TreeviewConfig} instance
     * @param config to apply
     */
    public setConfig(config: TreeviewConfig): void {
        this.treeviewConfig = config;
    }

    /**
     * Get the {TreeviewItem} array
     * @return the {TreeviewItem} array
     */
    public getTreeviewItems(): TreeviewItem[] {
        return this.treeviewItems || [];
    }

    /**
     * Set the {TreeviewItem} array
     * @param items to apply
     */
    public setTreeviewItems(items?: TreeviewItem[]): void {
        this.treeviewItems = items || [];
    }

    /**
     * Set the {TreeviewItem} data array
     * @param data to apply
     */
    public setTreeviewData(data?: any[] | Observable<any[]>): void {
        const treeBuilder: (data: any[]) => TreeviewItem[] = this.field.templateOptions['treeBuilder'];
        const itemBuilder: (data: any) => TreeviewItem = this.field.templateOptions['itemBuilder'];
        this.buildTemplateOptionsToTree(treeBuilder, itemBuilder, data);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {DropdownTreeviewFormFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_translateService, _renderer, _logger);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // query tree-view component
        if (!this.ngxTreeviewComponent) {
            // query component
            this.ngxTreeviewComponent = ComponentUtils.queryComponent(
                this.queryNgxTreeviewComponent, component => {
                    component && component.getSelectedChangeEvent()
                        .subscribe((e: IEvent) => this.onSelectedValue(e));
                });
        }

        // build field template config and options to apply tree-view component
        this.field.className = [(this.field.className || ''),
            'form-field form-dropdown-treeview form-dropdown-treeview-select'].join(' ').trim();
        if (this.field.templateOptions) {
            if (this.field.templateOptions['config'] instanceof TreeviewConfig) {
                this.setConfig(<TreeviewConfig>this.field.templateOptions['config']);
            }

            const treeBuilder: (data: any[]) => TreeviewItem[] = this.field.templateOptions['treeBuilder'];
            const itemBuilder: (data: any) => TreeviewItem = this.field.templateOptions['itemBuilder'];
            const options: any[] | Observable<any[]> = this.field.templateOptions.options;
            this.buildTemplateOptionsToTree(treeBuilder, itemBuilder, options);
        }
    }

    protected onValueChanges(value: any): void {
        super.onValueChanges(value);
        this.getTreeviewComponent() && this.setSelectedValue(value, false);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Build the specified options data to {TreeviewItem}
     * @param itemBuilder field template all options data builder
     * @param itemBuilder field template option builder
     * @param options to build
     */
    protected buildTemplateOptionsToTree(
        treeBuilder: (data: any[]) => TreeviewItem[],
        itemBuilder: (data: any) => TreeviewItem,
        options: any[] | Observable<any[]>): void {
        let items: TreeviewItem[] = [];
        if (isArray(options)) {
            if (!isNullOrUndefined(treeBuilder) && typeof treeBuilder === 'function') {
                items = treeBuilder.apply(this, [Array.from(options as any[])]);
                if (!isNullOrUndefined(items)) {
                    this.setTreeviewItems(items);
                }

            } if (!isNullOrUndefined(itemBuilder) && typeof itemBuilder === 'function') {
                Array.from(options as any[]).forEach(option => {
                    const item: TreeviewItem = itemBuilder.apply(this, [option]);
                    item && items.push(item);
                });
                this.setTreeviewItems(items);

            } else if (!isNullOrUndefined(this.getTreeviewComponent())) {
                items = this.getTreeviewComponent().mappingDataSourceToTreeviewItems(options);
                if (!isNullOrUndefined(items)) {
                    this.setTreeviewItems(items);
                }
            }

        } else if (isObservable(options)) {
            (<Observable<any[]>>options).subscribe(opts => {
                const optValues: any[] = (opts && isArray(opts) ? Array.from(opts) : opts ? [opts] : []);
                this.buildTemplateOptionsToTree(treeBuilder, itemBuilder, optValues);
            });

        } else if (!isNullOrUndefined(options) && !isArray(options) && !isObservable(options)) {
            this.buildTemplateOptionsToTree(treeBuilder, itemBuilder, [options]);
        }
    }

    /**
     * Raise when the selected value of dropdown treeview has been changed
     * @param e event data
     */
    private onSelectedValue(e: IEvent): void {
        let item: any;
        item = (e && e.data && isArray(e.data) && Array.from(e.data).length ? e.data[0] : null);
        if (!item || item instanceof TreeviewItem) {
            this.setTreeviewSelectedItem(item as TreeviewItem, false);

        } else {
            for (const it of this.getTreeviewItems()) {
                if (it.value === item) {
                    this.setTreeviewSelectedItem(it as TreeviewItem, false);
                    break;
                }
            }
        }
    }

    /**
     * Set the selected value
     * @param value to apply
     * @param updateValue true for updating
     * @return the affected {TreeviewItem}
     */
    public setSelectedValue(value: any, updateValue?: boolean | false): TreeviewItem {
        const treeViewComponent: NgxDropdownTreeviewComponent = this.getTreeviewComponent();
        if (!treeViewComponent) {
            return;
        }

        // apply selected value
        let selectedValue: TreeviewItem;
        selectedValue = this.valueFormatter(value);
        if (selectedValue) {
            treeViewComponent.internalProperty(
                selectedValue, 'internalChecked', true);
            treeViewComponent.internalProperty(
                selectedValue, 'internalCollapsed', false);
        }
        this.setTreeviewSelectedItem(selectedValue, updateValue);
        return selectedValue;
    }

    /**
     * Set the selected {TreeviewItem} and update model value if necessary
     * @param item {TreeviewItem} to select
     * @param updateValue true for updating
     */
    public setTreeviewSelectedItem(item?: TreeviewItem, updateValue?: boolean | false): void {
        const treeViewComponent: NgxDropdownTreeviewComponent = this.getTreeviewComponent();
        if (!treeViewComponent) {
            return;
        }

        const checked: boolean = treeViewComponent.internalPropertyValue(
            item, 'internalChecked', false);
        treeViewComponent.setSelectedTreeviewItems(checked ? [item] : [], true);
        const value: any = (checked ? this.valueParser(item) : null);
        if (this.value !== value) {
            this.formControl && this.formControl.patchValue(
                value, {onlySelf: true, emitEvent: updateValue});
        }
    }

    /**
     * Parse all items belong to the specified item
     * @param item to parse
     * @param items returned items array
     */
    private parseItemsRecursively(item?: TreeviewItem | null, items?: TreeviewItem[] | []): void {
        items = (items || []);
        item && items.push(item);
        item && (item.children || []).forEach(it => this.parseItemsRecursively(it, items));
    }

    /**
     * Disable the specified item and un-disable other items
     * @param item to disable
     */
    public disableItems(item?: TreeviewItem | null): void {
        let disabledItems: TreeviewItem[];
        disabledItems = [];
        this.parseItemsRecursively(item, disabledItems);
        (this.getTreeviewItems() || []).forEach(it => this.disableItemsRecursively(it, disabledItems));
    }
    /**
     * Check to disable/enable the specified item by the specified disabled items array
     * @param item to disable/enable
     * @param disabledItems disabled items to check
     */
    private disableItemsRecursively(item?: TreeviewItem | null, disabledItems?: TreeviewItem[] | []): void {
        const treeViewComponent: NgxDropdownTreeviewComponent = this.getTreeviewComponent();
        if (!treeViewComponent || !item) return;
        const disabled: boolean = ((disabledItems || []).indexOf(item) >= 0);
        treeViewComponent.internalProperty(item, 'internalDisabled', disabled);
        if (disabled) {
            treeViewComponent.internalProperty(item, 'internalChecked', false);
        }
        (item.children || []).forEach(it => this.disableItemsRecursively(it, disabledItems));
    }

    /**
     * Filter the specified value to find {TreeviewItem}
     * @param value to filter
     * @param key the property key of value to filter or null for checking only value
     * @return {TreeviewItem} or null
     */
    protected filterValueTreeItem(value: any, key?: string | null): TreeviewItem {
        let itemValue: TreeviewItem;
        itemValue = null;
        let items: TreeviewItem[];
        items = this.getTreeviewItems() || [];
        for (const it of items) {
            itemValue = this.filterValueTreeItemRecursively(value, key, it);
            if (itemValue) break;
        }
        return itemValue;
    }
    private filterValueTreeItemRecursively(
        value: any, key?: string | null, item?: TreeviewItem | null): TreeviewItem {
        let foundItem: TreeviewItem;
        foundItem = null;
        let found: boolean;
        found = (item === value || (item && item.value === value));
        if (!found && (key || '').length) {
            found = (item && item.value && value
                && (item.value[key] === value
                    || (Object.keys(value || {}).length
                        && (item.value[key] === value[key] || item.value === value[key]))));
        }
        if (!found && item && (item.children || []).length) {
            for (const it of item.children) {
                foundItem = this.filterValueTreeItemRecursively(value, key, it);
                if (foundItem) break;
            }

        } else if (found) {
            foundItem = item;
        }
        return foundItem;
    }
}

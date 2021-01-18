import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {TreeviewItem} from 'ngx-treeview';
import ComponentUtils from '../../../utils/common/component.utils';
import {IEvent} from '../abstract.component';
import {NgxDropdownTreeviewComponent} from '../treeview/treeview.dropdown.component';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {isObservable, Observable, Subscription} from 'rxjs';
import ObjectUtils from '../../../utils/common/object.utils';
import ArrayUtils from '../../../utils/common/array.utils';
import FunctionUtils from 'app/utils/common/function.utils';
import PromiseUtils from 'app/utils/common/promise.utils';

/**
 * Formly Treeview Dropdown field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown',
    templateUrl: './formly.treeview.dropdown.field.component.html',
    styleUrls: ['./formly.treeview.dropdown.field.component.scss'],
})
export class DropdownTreeviewFormFieldComponent extends AbstractFieldType
    implements AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    /* tree-view items array */
    private _items: TreeviewItem[];
    private __selectedChangedSubscription: Subscription;

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
    protected get treeviewComponent(): NgxDropdownTreeviewComponent {
        return this.ngxTreeviewComponent;
    }

    /**
     * Get the {TreeviewItem} array
     * @return the {TreeviewItem} array
     */
    @Input('items') get items(): TreeviewItem[] {
        return this._items || [];
    }

    /**
     * Set the {TreeviewItem} array
     * @param _items to apply
     */
    set items(_items: TreeviewItem[]) {
        this._items = _items || [];
    }

    /**
     * Set the {TreeviewItem} data array
     * @param data to apply
     */
    public set treeviewData(data: any[] | Observable<any[]>) {
        this.buildTemplateOptionsToTree(data);
    }

    get valueParser(): (value: any) => any {
        return value => {
            const itValue: TreeviewItem = ObjectUtils.cast(value, TreeviewItem);
            return (itValue && itValue.value ? itValue.value['id'] : (value || {})['id']);
        };
    }

    get valueFormatter(): (value: any) => any {
        return value => this.filterValueTreeItem(value, 'id');
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {DropdownTreeviewFormFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // query tree-view component
        if (!this.ngxTreeviewComponent) {
            // query component
            const _this: DropdownTreeviewFormFieldComponent = this;
            this.ngxTreeviewComponent = ComponentUtils.queryComponent(
                this.queryNgxTreeviewComponent, component => {
                    FunctionUtils.invokeTrue(
                        ObjectUtils.isNou(_this.__selectedChangedSubscription),
                        () => this.__selectedChangedSubscription = component.selectedChangeEvent.subscribe((e: IEvent) => this.onSelectedValue(e)),
                        _this);
                });
        }

        // build field template config and options to apply tree-view component
        if (this.field) {
            this.field.className = [(this.field.className || ''),
                'form-field form-dropdown-treeview form-dropdown-treeview-select'].join(' ').trim();
            if (this.field.templateOptions) {
                const options: any[] | Observable<any[]> = this.field.templateOptions.options;
                this.buildTemplateOptionsToTree(options);
            }
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__selectedChangedSubscription);
    }

    protected onValueChanges(value: any): void {
        // this.logger.debug(this.constructor.name, ' - onValueChanges', value);
        super.onValueChanges(value);
        this.treeviewComponent && this.setSelectedValue(value, false);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Build the specified options data to {TreeviewItem}
     * @param options to build
     */
    protected buildTemplateOptionsToTree(options: any[] | Observable<any[]>): void {
        const treeBuilder: (data: any[]) => TreeviewItem[] | null =
            (this.field && this.field.templateOptions
                ? this.field.templateOptions['treeBuilder'] : null)
            || this.getConfigValue('treeBuilder');
        const itemBuilder: (data: any) => TreeviewItem | null =
            (this.field && this.field.templateOptions
                ? this.field.templateOptions['itemBuilder'] : null)
            || this.getConfigValue('itemBuilder');
        let items: TreeviewItem[] = [];
        if (ArrayUtils.isArray(options)) {
            if (ObjectUtils.isNotNou(treeBuilder) && typeof treeBuilder === 'function') {
                items = treeBuilder.apply(this, [Array.from(options as any[])]);
                if (ObjectUtils.isNotNou(items)) {
                    this.items = items;
                }

            } if (ObjectUtils.isNotNou(itemBuilder) && typeof itemBuilder === 'function') {
                Array.from(options as any[]).forEach(option => {
                    const item: TreeviewItem = itemBuilder.apply(this, [option]);
                    item && items.push(item);
                });
                this.items = items;

            } else if (ObjectUtils.isNotNou(this.treeviewComponent)) {
                items = this.treeviewComponent.mappingDataSourceToTreeviewItems(options);
                if (ObjectUtils.isNotNou(items)) {
                    this.items = items;
                }
            }

        } else if (isObservable(options)) {
            const itemsSubscription: Subscription = (<Observable<any[]>>options).subscribe(opts => {
                const optValues: any[] = (opts && ArrayUtils.isArray(opts) ? Array.from(opts) : opts ? [opts] : []);
                this.buildTemplateOptionsToTree(optValues);
                PromiseUtils.unsubscribe(itemsSubscription);
            });

        } else if (ObjectUtils.isNotNou(options) && !ArrayUtils.isArray(options) && !isObservable(options)) {
            this.buildTemplateOptionsToTree([options]);
        }
    }

    /**
     * Raise when the selected value of dropdown treeview has been changed
     * @param e event data
     */
    protected onSelectedValue(e: IEvent): void {
        // this.logger.debug(this.constructor.name, ' - onSelectedValue', e);
        const item: any = (e && e.data && ArrayUtils.isArray(e.data) && Array.from(e.data).length ? e.data[0] : null);
        if (!item || item instanceof TreeviewItem) {
            this.setTreeviewSelectedItem(item as TreeviewItem, false);

        } else {
            for (const it of this.items) {
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
        const treeViewComponent: NgxDropdownTreeviewComponent = this.treeviewComponent;
        if (!treeViewComponent) {
            return;
        }

        // apply selected value
        const selectedValue: TreeviewItem = this.formatValue(value);
        // this.logger.debug(this.constructor.name, ' - setSelectedValue', value, selectedValue);
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
        // this.logger.debug(this.constructor.name, ' - setTreeviewSelectedItem', item);
        const treeViewComponent: NgxDropdownTreeviewComponent = this.treeviewComponent;
        if (!treeViewComponent) {
            return;
        }

        const checked: boolean = treeViewComponent.internalPropertyValue(
            item, 'internalChecked', false);
        treeViewComponent.setSelectedTreeviewItems(checked ? [item] : [], true);
        const value: any = (checked ? this.parseValue(item) : null);
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
        const disabledItems: TreeviewItem[] = [];
        this.parseItemsRecursively(item, disabledItems);
        this.items.forEach(it => this.disableItemsRecursively(it, disabledItems));
    }
    /**
     * Check to disable/enable the specified item by the specified disabled items array
     * @param item to disable/enable
     * @param disabledItems disabled items to check
     */
    private disableItemsRecursively(item?: TreeviewItem | null, disabledItems?: TreeviewItem[] | []): void {
        const treeViewComponent: NgxDropdownTreeviewComponent = this.treeviewComponent;
        if (!treeViewComponent || !item) return;
        const disabled: boolean = ((disabledItems || []).indexOf(item) >= 0);
        treeViewComponent.internalProperty(item, 'internalDisabled', disabled);
        disabled && treeViewComponent.internalProperty(item, 'internalChecked', false);
        (item.children || []).forEach(it => this.disableItemsRecursively(it, disabledItems));
    }

    /**
     * Filter the specified value to find {TreeviewItem}
     * @param value to filter
     * @param key the property key of value to filter or null for checking only value
     * @return {TreeviewItem} or null
     */
    protected filterValueTreeItem(value: any, key?: string | null): TreeviewItem {
        let itemValue: TreeviewItem = null;
        const items: TreeviewItem[] = this.items;
        for (const it of items) {
            itemValue = this.filterValueTreeItemRecursively(value, key, it);
            if (itemValue) break;
        }
        return itemValue;
    }
    private filterValueTreeItemRecursively(value: any, key?: string | null, item?: TreeviewItem | null): TreeviewItem {
        let foundItem: TreeviewItem = null;
        let found: boolean = (item === value || (item && item.value === value));
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

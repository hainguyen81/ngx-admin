import {
    AfterViewInit,
    Component,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {FieldType} from '@ngx-formly/material';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeviewItem} from 'ngx-treeview';
import ComponentUtils from '../../../utils/component.utils';
import {isObservable, Observable} from 'rxjs';
import {IEvent} from '../abstract.component';
import {NgxDropdownTreeviewComponent} from '../treeview/treeview.dropdown.component';
import {DefaultTreeviewConfig} from '../treeview/abstract.treeview.component';
import {isArray} from 'util';

/**
 * Formly Treeview Dropdown field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown',
    templateUrl: './formly.treeview.dropdown.field.html',
    styleUrls: ['./formly.treeview.dropdown.field.scss'],
})
export class DropdownTreeviewFormFieldComponent extends FieldType implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private config: TreeviewConfig;
    private items: TreeviewItem[];

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
    protected getConfig(): TreeviewConfig {
        return this.config;
    }

    /**
     * Get the {TreeviewItem} array
     * @return the {TreeviewItem} array
     */
    protected getTreeviewItems(): TreeviewItem[] {
        return this.items;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        if (!this.ngxTreeviewComponent) {
            // query component
            this.ngxTreeviewComponent = ComponentUtils.queryComponent(
                this.queryNgxTreeviewComponent, component => {
                    component
                    && component.getSelectedChangeEvent().subscribe(
                        (e: IEvent) => this.onSelectedValue(e));
                });

            // initialization
            this.initialize();
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Formatter function to format the model value to {TreeviewItem} instance to show
     * @param value model value to format
     */
    protected valueFormatter(value: any): TreeviewItem {
        return value as TreeviewItem;
    }

    /**
     * Parser function to parse {TreeviewItem} or data instance to the model value
     * @param value {TreeviewItem} or data to parse
     */
    protected valueParser(value?: any): any {
        let parsedValue: any;
        parsedValue = value;
        if (this.field) {
            for (const parser of (this.field.parsers || [])) {
                parsedValue = parser.apply(this, [parsedValue]);
            }
        }
        return parsedValue;
    }

    /**
     * Initialize
     */
    private initialize() {
        if (this.field && this.field.templateOptions) {
            if (Array.isArray(this.field.templateOptions.options)) {
                this.initializeTreeviewComponentFromTemplateOptions(this.field.templateOptions.options);

            } else if (isObservable(this.field.templateOptions.options)) {
                (this.field.templateOptions.options as Observable<any>).subscribe(
                    options => this.initializeTreeviewComponentFromTemplateOptions(options));
            }
        }
    }

    private initializeTreeviewComponentFromTemplateOptions(options: any[]): void {
        // treeview configuration
        let config: TreeviewConfig;
        config = ((options || []).length ? options[0] as TreeviewConfig : DefaultTreeviewConfig);
        this.config = (config && Object.keys(config).length ? config : DefaultTreeviewConfig);
        this.getTreeviewComponent() && this.getTreeviewComponent().setConfig(this.config);

        // treeview items
        let items: TreeviewItem[];
        items = [];
        if ((options || []).length && Array.isArray(options[1])) {
            Array.from(options[1]).forEach(option => {
                let item: TreeviewItem;
                item = option as TreeviewItem;
                item && items.push(option as TreeviewItem);
            });
        }
        this.items = [].concat(items);
        this.getTreeviewComponent() && this.getTreeviewComponent().setTreeviewItems(this.items);

        // apply selected value
        let selectedValue: TreeviewItem;
        selectedValue = this.valueFormatter(this.value);
        if (selectedValue) {
            selectedValue.checked = true;
            this.getTreeviewComponent()
            && this.setTreeviewSelectedItem(selectedValue, false);
        }
    }

    /**
     * Raise when the selected value of dropdown treeview has been changed
     * @param e event data
     */
    private onSelectedValue(e: IEvent): void {
        if (!this.getTreeviewComponent()) {
            return;
        }

        let item: any;
        item = (e && e.$data && isArray(e.$data) && Array.from(e.$data).length ? e.$data[0] : null);
        if (!item || item instanceof TreeviewItem) {
            this.setTreeviewSelectedItem(item as TreeviewItem, true);

        } else {
            for (const it of this.getTreeviewItems()) {
                if (it.value === item) {
                    this.setTreeviewSelectedItem(it as TreeviewItem, true);
                    break;
                }
            }
        }
    }

    /**
     * Set the selected {TreeviewItem} and update model value if necessary
     * @param item {TreeviewItem} to select
     * @param updateValue true for updating
     */
    private setTreeviewSelectedItem(item?: TreeviewItem, updateValue?: boolean | false): void {
        this.getTreeviewComponent().setSelectedTreeviewItems(item && item.checked ? [item] : [], true);
        this.value = (item && item.checked ? this.valueParser(item) : null);
        if (updateValue) {
            this.formControl && this.formControl.setValue(this.value);
            this.formControl && this.formControl.updateValueAndValidity({onlySelf: true, emitEvent: true});
        }
    }
}

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
export class DropdownTreeviewFormFieldComponent extends FieldType
    implements OnInit, AfterViewInit {

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

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        if (!this.ngxTreeviewComponent) {
            this.ngxTreeviewComponent = ComponentUtils.queryComponent(
                this.queryNgxTreeviewComponent, (component) => {
                    component
                    && component.getSelectedChangeEvent().subscribe(
                        (e: IEvent) => this.onSelectedValue(e));
                });
            this.initialize();
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

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
        this.ngxTreeviewComponent && this.ngxTreeviewComponent.setConfig(this.config);

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
        this.ngxTreeviewComponent && this.ngxTreeviewComponent.setTreeviewItems(this.items);

        // selected value
        this.formControl && this.formControl.patchValue(value => {
            this.value = value;
            this.ngxTreeviewComponent && this.ngxTreeviewComponent
                .setSelectedTreeviewItemByKeys([this.value], true);
        });
    }

    private onSelectedValue(e: IEvent): void {
        if (!this.getTreeviewComponent()) {
            return;
        }

        let item: TreeviewItem;
        item = (e && e.$data && isArray(e.$data) && Array.from(e.$data).length ? e.$data[0] as TreeviewItem : null);
        (this.getTreeviewComponent().getTreeviewSelection().checkedItems || []).forEach(it => {
            it.checked = false;
        });
        if (item) item.checked = true;
        this.value = this.getTreeviewComponent().getTreeviewItemKey(item);
        this.formControl && this.formControl.setValue(this.value);
    }
}

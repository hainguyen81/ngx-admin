import {AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FieldType} from '@ngx-formly/material';
import {TreeviewConfig} from 'ngx-treeview/src/treeview-config';
import {TreeviewItem} from 'ngx-treeview';
import ComponentUtils from '../../../utils/component.utils';
import {isObservable, Observable} from 'rxjs';
import {IEvent} from '../abstract.component';
import {NgxDropdownTreeviewComponent} from '../treeview/treeview.dropdown.component';

/**
 * Formly Treeview Dropdown field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown',
    templateUrl: './formly.treeview.dropdown.field.html',
    styleUrls: ['./formly.treeview.dropdown.field.scss'],
})
export class DropdownTreeviewFormFieldComponent extends FieldType
    implements AfterViewInit, OnInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgxDropdownTreeviewComponent)
    private readonly queryNgxTreeviewComponent: QueryList<NgxDropdownTreeviewComponent>;
    private ngxTreeviewComponent: NgxDropdownTreeviewComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    @Input()
    get value(): any | null {
        return this.value;
    }
    set value(val: any | null) {
        this.value = val;
        this.formControl && this.formControl.setValue(this.value);
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
                        (event: IEvent) => window.console.log('Select treeview item', event));
                });
        }
    }

    ngOnInit(): void {
        if (this.field && this.field.templateOptions) {
            if (Array.isArray(this.field.templateOptions.options)) {
                this.initializeTreeviewComponentFromTemplateOptions(this.field.templateOptions.options);

            } else if (isObservable(this.field.templateOptions.options)) {
                (this.field.templateOptions.options as Observable<any>).subscribe(
                    options => this.initializeTreeviewComponentFromTemplateOptions(options));
            }
        }

        this.formControl && this.formControl.patchValue(value => {
            this.value = value;
            this.ngxTreeviewComponent
            && this.ngxTreeviewComponent.setSelectedTreeviewItemByKeys(this.value);
        });
    }

    private initializeTreeviewComponentFromTemplateOptions(options: any[]): void {
        if (!this.ngxTreeviewComponent) {
            return;
        }

        if ((options || []).length && options[0] instanceof TreeviewConfig) {
            this.ngxTreeviewComponent.setConfig(options[0] as TreeviewConfig);
        }
        if ((options || []).length && Array.isArray(options[1])) {
            let items: TreeviewItem[];
            items = [];
            Array.from(options[1]).forEach(option => {
                if (option instanceof TreeviewItem) {
                    items.push(option as TreeviewItem);
                }
            });
            this.ngxTreeviewComponent.setTreeviewItems(items);
        }
    }
}

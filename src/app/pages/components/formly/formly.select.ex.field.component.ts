import {AfterViewInit, Component, Inject, Input, QueryList, ViewChildren} from '@angular/core';
import {AbstractFieldType} from '../abstract.fieldtype';
import {INgxSelectOptions} from 'ngx-select-ex';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {NgxSelectExComponent} from '../select-ex/select.ex.component';

/**
 * Formly Select-Ex field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-select-ex',
    templateUrl: './formly.select.ex.field.component.html',
    styleUrls: ['./formly.select.ex.field.component.scss'],
})
export class SelectExFormFieldComponent extends AbstractFieldType implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @Input() private config: INgxSelectOptions;
    /**
     * Items array.
     * Should be an array of objects with id and text properties.
     * As convenience, you may also pass an array of strings,
     * in which case the same string is used for both the ID and the text.
     * Items may be nested by adding a options property to any item,
     * whose value should be another array of items.
     * Items that have children may omit to have an ID.
     */
    @Input() private items: any[];

    @ViewChildren(NgxSelectExComponent)
    private readonly queryNgxSelectExComponent: QueryList<NgxSelectExComponent>;
    private ngxSelectExComponent: NgxSelectExComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgxSelectExComponent} instance
     * @return the {NgxSelectExComponent} instance
     */
    protected get selectExComponent(): NgxSelectExComponent {
        return this.ngxSelectExComponent;
    }

    /**
     * Get the {INgxSelectOptions} instance
     * @return the {INgxSelectOptions} instance
     */
    public getConfig(): INgxSelectOptions {
        return this.config;
    }
    /**
     * Set the {INgxSelectOptions} instance
     * @param config to apply
     */
    public setConfig(config: INgxSelectOptions): void {
        this.config = config;
    }

    /**
     * Get the {NgxSelectOption} array
     * @return the {NgxSelectOption} array
     */
    public getItems(): any[] {
        return this.items || [];
    }

    /**
     * Set the {NgxSelectOption} array
     * @param items to apply
     */
    public setItems(items?: any[]): void {
        this.items = (items || []);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SelectExFormFieldComponent} class
     * @param translateService {TranslateService}
     */
    constructor(@Inject(TranslateService) _translateService: TranslateService) {
        super(_translateService);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        if (!this.ngxSelectExComponent) {
            // query component
            this.ngxSelectExComponent = ComponentUtils.queryComponent(this.queryNgxSelectExComponent);
        }
    }
}

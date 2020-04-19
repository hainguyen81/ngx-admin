import {
    AfterViewInit,
    Component,
    Inject,
    Input,
    QueryList, Renderer2,
    ViewChildren,
} from '@angular/core';
import {AbstractFieldType} from '../abstract.fieldtype';
import {INgxSelectOptions, NgxSelectOption} from 'ngx-select-ex';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {NgxSelectExComponent} from '../select-ex/select.ex.component';
import {IEvent} from '../abstract.component';
import {isArray} from 'util';
import {NGXLogger} from 'ngx-logger';

/**
 * Formly Select-Ex field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-select-ex',
    templateUrl: './formly.select.ex.field.component.html',
    styleUrls: ['./formly.select.ex.field.component.scss'],
})
export class SelectExFormFieldComponent extends AbstractFieldType implements AfterViewInit {

    private static DEFAULT_CLASS_FORM_FIELD: string = 'form-field-select-ex';
    private static IMAGE_CLASS_FORM_FIELD: string = 'form-field-select-ex-image';

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
        if (!this.ngxSelectExComponent) {
            // query component
            this.ngxSelectExComponent = ComponentUtils.queryComponent(
                this.queryNgxSelectExComponent, component => {
                    component && component.finishedLoading.subscribe(
                        value => this.__applySelectedItems(component, this.value));
                    this.formControl
                    && this.formControl.valueChanges.subscribe(
                        val => this.__applySelectedItems(component, val));
                    this.checkOverrideFormFieldClass(component);
                });
        }
    }

    /**
     * Check for adding/removing form field class for customizing
     */
    private checkOverrideFormFieldClass(selectComponent?: NgxSelectExComponent) {
        if (this.formField && this.formField._elementRef
            && this.formField._elementRef.nativeElement) {
            const enabledImage: boolean = (selectComponent && selectComponent.isEnabledOptionImage());
            enabledImage && this.renderer.removeClass(
                this.formField._elementRef.nativeElement,
                SelectExFormFieldComponent.DEFAULT_CLASS_FORM_FIELD);
            !enabledImage && this.renderer.removeClass(
                this.formField._elementRef.nativeElement,
                SelectExFormFieldComponent.IMAGE_CLASS_FORM_FIELD);
            enabledImage && this.renderer.addClass(
                this.formField._elementRef.nativeElement,
                SelectExFormFieldComponent.IMAGE_CLASS_FORM_FIELD);
            !enabledImage && this.renderer.addClass(
                this.formField._elementRef.nativeElement,
                SelectExFormFieldComponent.DEFAULT_CLASS_FORM_FIELD);
        }
    }

    /**
     * Set current value
     * @param value to apply
     */
    public setValue(value?: any): void {
        value = this.valueParser(value);
        if (this.value !== value) {
            this.value = value;
            this.formControl && this.formControl.setValue(this.value);
            this.formControl && this.formControl.updateValueAndValidity({onlySelf: true, emitEvent: true});
        }
    }

    private __applySelectedItems(selectComponent?: NgxSelectExComponent, value?: any) {
        selectComponent = (selectComponent || this.selectExComponent);
        if (!selectComponent || !this.getItems().length) return;
        value = this.valueFormatter(value);
        selectComponent.setSelectedItems(isArray(value) ? Array.from(value) : [value]);
    }

    protected onSelect($event: IEvent): void {
        this.setValue(($event || {}).$data);
    }

    public get selectedOptions(): NgxSelectOption[] {
        return (this.selectExComponent ? this.selectExComponent.selectedOptions : []);
    }

    public get selectedValues(): any[] {
        return (this.selectExComponent ? this.selectExComponent.selectedOptionValues : []);
    }
}

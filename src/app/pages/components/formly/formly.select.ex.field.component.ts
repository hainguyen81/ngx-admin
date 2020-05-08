import {
    AfterViewInit, ChangeDetectorRef,
    Component, ComponentFactoryResolver, ElementRef,
    Inject,
    Input,
    QueryList, Renderer2,
    ViewChildren, ViewContainerRef,
} from '@angular/core';
import {AbstractFieldType} from '../abstract.fieldtype';
import {NgxSelectOption} from 'ngx-select-ex';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {NgxSelectExComponent} from '../select-ex/select.ex.component';
import {IEvent} from '../abstract.component';
import {isArray} from 'util';
import {NGXLogger} from 'ngx-logger';
import {isObservable} from 'rxjs';

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

    /**
     * Items array.
     * Should be an array of objects with id and text properties.
     * As convenience, you may also pass an array of strings,
     * in which case the same string is used for both the ID and the text.
     * Items may be nested by adding a options property to any item,
     * whose value should be another array of items.
     * Items that have children may omit to have an ID.
     */
    @Input() private _items: any[];

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
     * Get the {NgxSelectOption} array
     * @return the {NgxSelectOption} array
     */
    get items(): any[] {
        return this._items || [];
    }

    /**
     * Set the {NgxSelectOption} array
     * @param _items to apply
     */
    set items(_items: any[]) {
        this._items = (_items || []);
    }

    get selectedOptions(): NgxSelectOption[] {
        return (this.selectExComponent ? this.selectExComponent.selectedOptions : []);
    }

    get selectedValues(): any[] {
        return (this.selectExComponent ? this.selectExComponent.selectedOptionValues : []);
    }

    get valueFormatter(): (value: any) => any {
        return value => {
            let options: any[];
            options = this.items.filter(opt => {
                return (opt && ((opt === value)
                    || (opt[this.getConfigValue('optionValueField')] === value)));
            });
            return options || [];
        };
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SelectExFormFieldComponent} class
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

        // query select-ex component
        if (!this.ngxSelectExComponent) {
            // query component
            this.ngxSelectExComponent = ComponentUtils.queryComponent(
                this.queryNgxSelectExComponent, component => {
                    component && component.finishedLoading.subscribe(
                        value => this.__applySelectedItems(component, this.value));
                    this.checkOverrideFormFieldClass(component);
                });
        }

        // build field template config and options before query select-ex component
        this.field.className = [(this.field.className || ''),
            'form-field form-select-ex'].join(' ').trim();
        if (this.field && this.field.templateOptions
            && isArray(this.field.templateOptions.options)) {
            this.items = this.field.templateOptions.options as any[];

        } else if (this.field && this.field.templateOptions
            && isObservable(this.field.templateOptions.options)) {
            this.field.templateOptions.options.subscribe((items: any[]) => {
                this.items = this.field.templateOptions.options as any[];
            });
        }
    }

    protected onValueChanges(value: any): void {
        this.selectExComponent
        && this.__applySelectedItems(null, value);
    }

    protected onStatusChanges(value: any): void {
        if (value === 'DISABLED' && this.selectExComponent && this.config) {
            this.config.disabled = this.field.formControl.disabled;
        }
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

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
        value = this.parseValue(value);
        if (this.value !== value) {
            this.formControl && this.formControl.patchValue(
                value, {onlySelf: true, emitEvent: true});
        }
    }

    private __applySelectedItems(selectComponent?: NgxSelectExComponent, value?: any) {
        selectComponent = (selectComponent || this.selectExComponent);
        if (!selectComponent || !this.items.length) return;
        value = this.formatValue(value);
        selectComponent.setSelectedItems(isArray(value) ? Array.from(value) : [value]);
    }

    protected onSelect($event: IEvent): void {
        this.setValue(($event || {}).data);
    }
}

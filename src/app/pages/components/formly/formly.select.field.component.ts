import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Input,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {isArray, isNullOrUndefined} from 'util';
import {NGXLogger} from 'ngx-logger';
import {isObservable} from 'rxjs';
import {NgxSelectComponent} from '../select/select.component';
import {NgOption} from '@ng-select/ng-select';

/**
 * Formly Select-Ex field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-select',
    templateUrl: './formly.select.field.component.html',
    styleUrls: ['./formly.select.field.component.scss'],
})
export class SelectFormFieldComponent extends AbstractFieldType implements AfterViewInit {

    private static DEFAULT_CLASS_FORM_FIELD: string = 'form-field-ngx-select';
    private static IMAGE_CLASS_FORM_FIELD: string = 'form-field-ngx-select-image';

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

    @ViewChildren(NgxSelectComponent)
    private readonly queryNgxSelectComponent: QueryList<NgxSelectComponent>;
    private ngxSelectComponent: NgxSelectComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgxSelectComponent} instance
     * @return the {NgxSelectComponent} instance
     */
    protected get selectComponent(): NgxSelectComponent {
        return this.ngxSelectComponent;
    }

    /**
     * Get the items array
     * @return the items array
     */
    get items(): any[] {
        return this._items || [];
    }

    /**
     * Set the items array
     * @param _items to apply
     */
    set items(_items: any[]) {
        this._items = (_items || []);
    }

    /**
     * Get the selected options
     * @return the selected options
     */
    get selectedItems(): NgOption[] {
        return (this.selectComponent ? this.selectComponent.selectedItems : []);
    }

    /**
     * Get the selected values
     * @return the selected values
     */
    get selectedValues(): any[] {
        return (this.selectComponent ? this.selectComponent.selectedValues : []);
    }

    get valueFormatter(): (value: any) => any {
        return value => {
            if (isNullOrUndefined(this.selectComponent)) {
                return undefined;
            }

            return this.selectComponent.findItems(value);
        };
    }

    get valueParser(): (value: any) => any {
        return value => {
            if (isNullOrUndefined(this.selectComponent)) {
                return undefined;
            }

            const parsedValues: any[] = [];
            const rawValues: any[] = (isArray(value)
                ? Array.from(value) : !isNullOrUndefined(value) ? [value] : []);
            const mutiple: boolean = this.getConfigValue('multiple', false);
            rawValues.forEach(rawValue => {
                const parsedValue: any = this.selectComponent.getBindValue(rawValue);
                parsedValue && parsedValues.push(parsedValue);
                isNullOrUndefined(parsedValue) && parsedValues.push(rawValue);
            });
            return (mutiple ? parsedValues : parsedValues.length ? parsedValues[0] : undefined);
        };
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SelectFormFieldComponent} class
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
        if (!this.ngxSelectComponent) {
            // query component
            this.ngxSelectComponent = ComponentUtils.queryComponent(
                this.queryNgxSelectComponent, component => {
                    if (!isNullOrUndefined(component)) {
                        component.open.subscribe(e => {
                            if (this.field) this.field.focus = true;
                        });
                        component.close.subscribe(e => {
                            if (this.field) this.field.focus = false;
                        });
                        component.change.subscribe(e => {
                            this.value = (e || {})['data'];
                        });
                        component.load.subscribe(e => {
                            const timer: number = window.setTimeout(() => {
                                this.setSelectedValue(this.value);
                                window.clearTimeout(timer);
                            }, 200);
                        });
                    }
                    this.checkOverrideFormFieldClass();
                });
        }

        // build field template config and options before query select-ex component
        if (this.field) {
            this.field.className = [(this.field.className || ''),
                'form-field form-ngx-select'].join(' ').trim();
            if (this.field.templateOptions
                && isArray(this.field.templateOptions.options)) {
                this.items = this.field.templateOptions.options as any[];

            } else if (this.field.templateOptions
                && isObservable(this.field.templateOptions.options)) {
                this.field.templateOptions.options.subscribe((items: any[]) => {
                    this.items = this.field.templateOptions.options as any[];
                });
            }
        }
    }

    protected onStatusChanges(value: any): void {
        if (value === 'DISABLED' && this.selectComponent) {
            this.config.readonly = (this.field && this.field.formControl && this.field.formControl.disabled);
        }
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    /**
     * Check for adding/removing form field class for customizing
     */
    private checkOverrideFormFieldClass() {
        if (this.field && this.formField && this.formField._elementRef
            && this.formField._elementRef.nativeElement) {
            const enabledImage: boolean = this.getConfigValue('enableImage', false);
            enabledImage && this.renderer.removeClass(
                this.formField._elementRef.nativeElement,
                SelectFormFieldComponent.DEFAULT_CLASS_FORM_FIELD);
            !enabledImage && this.renderer.removeClass(
                this.formField._elementRef.nativeElement,
                SelectFormFieldComponent.IMAGE_CLASS_FORM_FIELD);
            enabledImage && this.renderer.addClass(
                this.formField._elementRef.nativeElement,
                SelectFormFieldComponent.IMAGE_CLASS_FORM_FIELD);
            !enabledImage && this.renderer.addClass(
                this.formField._elementRef.nativeElement,
                SelectFormFieldComponent.DEFAULT_CLASS_FORM_FIELD);
        }
    }

    public findItems(values: any[]): NgOption[] {
        if (isNullOrUndefined(this.selectComponent)) {
            return [];
        }
        return this.selectComponent.findItems(values);
    }

    /**
     * Set the dropdown selected value
     * @param _value to apply
     */
    public setSelectedValue(_value: any) {
        if (!isNullOrUndefined(this.selectComponent)) {
            this.selectComponent.selectedValues =
                (isArray(_value) ? _value : !isNullOrUndefined(_value) ? [_value] : undefined);
        }
    }
}

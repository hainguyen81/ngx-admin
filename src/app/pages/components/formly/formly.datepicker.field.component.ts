import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {AbstractFieldType} from '../abstract.fieldtype';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {INgxDatePickerConfig} from '../datepicker/abstract.datepicker.component';
import {IDatePickerConfig} from 'ng2-date-picker';
import {isNullOrUndefined} from 'util';
import {Moment} from 'moment';
import moment from 'moment';
import {NgxDatePickerComponent} from '../datepicker/datepicker.component';
import ComponentUtils from '../../../utils/component.utils';
import {IEvent} from '../abstract.component';

/**
 * Formly date-picker field component base on {FieldType}
 */
@Component({
    selector: 'ngx-formly-date-picker-field',
    templateUrl: './formly.datepicker.field.component.html',
    styleUrls: ['./formly.datepicker.field.component.scss'],
})
export class DatePickerFormFieldComponent extends AbstractFieldType implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgxDatePickerComponent)
    private readonly queryDatePickerComponent: QueryList<NgxDatePickerComponent>;
    private _datePickerComponent: NgxDatePickerComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgxDatePickerComponent} instance
     * @return the {NgxDatePickerComponent} instance
     */
    protected get datePickerComponent(): NgxDatePickerComponent {
        return this._datePickerComponent;
    }

    get config(): any {
        return super.config;
    }

    set config(_config: any) {
        super.config = _config;
        const __config: INgxDatePickerConfig = _config as INgxDatePickerConfig;
        const __dtConfig: IDatePickerConfig = (__config ? __config.config : undefined);
        if (!isNullOrUndefined(__dtConfig) && (__dtConfig.format || '').length) {
            __dtConfig.format = this.translate(__dtConfig.format);
        }
        if (this.datePickerComponent) {
            this.datePickerComponent.config = _config;
        }
    }

    /**
     * Get the date/time format pattern from configuration
     * @return the date/time format pattern from configuration
     */
    get dateTimePattern(): string {
        const __config: INgxDatePickerConfig = this.config as INgxDatePickerConfig;
        const __dtConfig: IDatePickerConfig = (__config ? __config.config : undefined);
        return isNullOrUndefined(__dtConfig) ? '' : __dtConfig.format;
    }

    get valueParser(): (value: any) => any {
        return value => {
            const momentValue: Moment = value as Moment;
            const dtValue: Date = value as Date;
            const numberValue: number = value as number;
            return (momentValue ? moment(momentValue).format(this.dateTimePattern)
                : dtValue ? moment(dtValue).format(this.dateTimePattern)
                    : numberValue ? moment(numberValue).format(this.dateTimePattern)
                        : value ? moment(value.toString()).format(this.dateTimePattern) : undefined);
        };
    }

    get valueFormatter(): (value: any) => any {
        return value => (value ? moment(value, this.dateTimePattern) : undefined);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageGalleryFormFieldComponent} class
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

        if (!this._datePickerComponent) {
            this._datePickerComponent = ComponentUtils.queryComponent(
                this.queryDatePickerComponent, component => {
                    component
                    && component.openListener.subscribe(e => {
                        this.field.focus = true;
                        this.field.formControl
                        && this.field.formControl.markAsTouched({ onlySelf: true });
                        this.stateChanges.next();
                    });
                    component
                    && component.closeListener.subscribe(e => {
                        this.field.focus = false;
                        this.stateChanges.next();
                    });
                    component
                    && component.selectListener.subscribe((e: IEvent) => {
                        this.field.focus = true;
                        this.field.formControl
                        && this.field.formControl.markAsTouched({ onlySelf: true });
                        component.model = e.data['date'];
                        this.value = component.model;
                    });
                });
        }
    }

    protected onValueChanges(value: any): void {
        super.onValueChanges(value);
        if (this.datePickerComponent) {
            const timer: number = window.setTimeout(() => {
                this.datePickerComponent.displayDate = moment(this.value).format(this.dateTimePattern);
                this.datePickerComponent.model = this.value;
                this.datePickerComponent.selected = (this.value ? [this.value] : []);
                window.clearTimeout(timer);
            }, 200);
        }
    }
}

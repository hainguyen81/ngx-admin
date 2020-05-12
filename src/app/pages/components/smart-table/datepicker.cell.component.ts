import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef, forwardRef,
    Host,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {INgxDatePickerConfig} from '../datepicker/abstract.datepicker.component';
import {IDatePickerConfig} from 'ng2-date-picker';
import {isNullOrUndefined} from 'util';
import moment, {Moment} from 'moment';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';

/**
 * Smart table date-picker cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-date-picker-cell',
    templateUrl: './datepicker.cell.component.html',
    styleUrls: ['./datepicker.cell.component.scss'],
})
export class DatePickerCellComponent extends AbstractCellEditor {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get cellColumnConfig(): any {
        const __config: INgxDatePickerConfig = super.cellColumnConfig as INgxDatePickerConfig;
        const __dtConfig: IDatePickerConfig = (__config ? __config.config : undefined);
        if (!isNullOrUndefined(__dtConfig) && (__dtConfig.format || '').length) {
            __dtConfig.format = this.translate(__dtConfig.format);
        }
        return __config;
    }

    /**
     * Get the date/time format pattern from configuration
     * @return the date/time format pattern from configuration
     */
    get dateTimePattern(): string {
        const __config: INgxDatePickerConfig = this.cellColumnConfig as INgxDatePickerConfig;
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
     * Create a new instance of {DatePickerCellComponent} class
     * @param _parentCell {CellComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_parentCell, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }
}

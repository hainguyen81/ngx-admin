import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {CellComponent} from 'ng2-smart-table/lib/components/cell/cell.component';
import {IEvent} from '../abstract.component';

/**
 * Smart table number cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-number-cell',
    templateUrl: './number.cell.component.html',
    styleUrls: ['./number.cell.component.scss'],
})
export class NumberCellComponent extends AbstractCellEditor {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get cellValue(): number {
        return (isNaN(super.cellValue) ? undefined : super.cellValue as number);
    }

    get newCellValue(): number {
        return (isNaN(super.newCellValue) ? undefined : super.newCellValue as number);
    }

    set newCellValue(_value: number) {
        super.newCellValue = (isNaN(_value) ? undefined : _value);
    }

    get isCurrency(): boolean {
        return (this.cellColumnConfig && (this.cellColumnConfig['isCurrency'] || false));
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {NumberCellComponent} class
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

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    onDataChanged($event: IEvent): void {
        this.fireCellChanged($event);
    }
}

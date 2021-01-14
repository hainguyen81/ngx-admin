import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, forwardRef, Inject, Renderer2, ViewContainerRef,} from '@angular/core';
import {NumberCellComponent} from './number.cell.component';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {CellComponent} from '@app/types/index';

/**
 * Smart table row number cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-row-number-cell',
    templateUrl: './number.cell.component.html',
    styleUrls: ['./number.cell.component.scss'],
})
export class RowNumberCellComponent extends NumberCellComponent {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get isEditable(): boolean {
        return false;
    }

    get cellValue(): number {
        return (this.cellRow ? this.cellRow.index + 1 : 1);
    }

    get isCurrency(): boolean {
        return false;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {RowNumberCellComponent} class
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

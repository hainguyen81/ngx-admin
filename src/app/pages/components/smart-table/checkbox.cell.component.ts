import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef, forwardRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';
import {IEvent} from '../abstract.component';

/**
 * Smart table checkbox cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-checkbox-cell',
    templateUrl: './checkbox.cell.component.html',
    styleUrls: ['./checkbox.cell.component.scss'],
})
export class CheckboxCellComponent extends AbstractCellEditor {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CheckboxCellComponent} class
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

    onCheckChanged($event: IEvent): void {
        this.fireCellChanged($event);
    }
}

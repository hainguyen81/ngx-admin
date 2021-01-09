import {
    AfterViewInit,
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

/**
 * Smart table observe cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-observe-cell',
    templateUrl: './observe.cell.component.html',
    styleUrls: ['./observe.cell.component.scss'],
})
export class ObserveCellComponent extends AbstractCellEditor
    implements AfterViewInit {

    private static OBSERVE_CELL_VALUE_PREPARE: string = 'valuePrepare';

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _observedValue: any;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get isEditable(): boolean {
        return false;
    }

    get cellValue(): any {
        return this._observedValue || '';
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageCellComponent} class
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

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // observe images
        this.observeConfigProperty(ObserveCellComponent.OBSERVE_CELL_VALUE_PREPARE)
            .subscribe(observedValue => this._observedValue = observedValue);
    }
}

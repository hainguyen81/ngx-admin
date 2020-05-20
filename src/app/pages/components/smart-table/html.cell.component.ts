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
import {Cell} from 'ng2-smart-table';
import {Column} from 'ng2-smart-table/lib/data-set/column';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';

/**
 * Smart table checkbox cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-html-cell',
    templateUrl: './html.cell.component.html',
    styleUrls: ['./html.cell.component.scss'],
})
export class HtmlCellComponent extends AbstractCellEditor {

    private static HTML_VALUE_PREPARE_FUNCTION: string = 'htmlValuePrepare';

    get isEditable(): boolean {
        return false;
    }

    get cellValue(): any {
        let htmlValue: string = '';
        const cell: Cell = this.cell;
        const config: any = this.cellColumnConfig;
        const column: Column = this.cellColumn;
        if (column && Object.keys(column).length
            && column.hasOwnProperty(HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION)) {
            if (typeof column[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION] === 'function') {
                htmlValue = column[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION]
                    .call(undefined, this, cell, this.cellRow, this.cellRowData, this.cellColumnConfig);
            } else {
                htmlValue = column[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION] || '';
            }

        } else if (config && Object.keys(config).length
            && config.hasOwnProperty(HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION)) {
            if (typeof config[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION] === 'function') {
                htmlValue = config[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION]
                    .call(undefined, this, cell, this.cellRow, this.cellRowData, this.cellColumnConfig);
            } else {
                htmlValue = config[HtmlCellComponent.HTML_VALUE_PREPARE_FUNCTION] || '';
            }
        }
        return htmlValue;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {HtmlCellComponent} class
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

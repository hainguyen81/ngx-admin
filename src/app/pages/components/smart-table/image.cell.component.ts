import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Host,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {Cell} from 'ng2-smart-table';
import {isArray} from 'util';
import {CustomViewComponent} from 'ng2-smart-table/components/cell/cell-view-mode/custom-view.component';
import {AbstractCellEditor} from './abstract.cell.editor';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Column} from 'ng2-smart-table/lib/data-set/column';

/**
 * Smart table image cell component base on {DefaultEditor}
 */
@Component({
    selector: 'ngx-smart-table-image-cell',
    templateUrl: './image.cell.component.html',
    styleUrls: ['./image.cell.component.scss'],
})
export class ImageCellComponent extends AbstractCellEditor {

    private static DESCRIPTOR_PREPARE: string = 'descriptorPrepare';

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get isEditable(): boolean {
        return false;
    }

    get images(): string[] {
        if (isArray(super.cellValue)) {
            return Array.from(super.cellValue) as string[];
        } else if (super.cellValue) {
            return [super.cellValue] as string[];
        }
        return [];
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {ImageCellComponent} class
     * @param _parentView {CustomViewComponent}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Host() _parentView: CustomViewComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_parentView, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    /**
     * Get the image component descriptor
     * @return the image component descriptor
     */
    public getDescriptor(): string {
        let descriptor: string = '';
        const cell: Cell = this.cell;
        const config: any = this.cellColumnConfig;
        const column: Column = this.cellColumn;
        if (column && Object.keys(column).length
            && column.hasOwnProperty(ImageCellComponent.DESCRIPTOR_PREPARE)) {
            if (typeof column[ImageCellComponent.DESCRIPTOR_PREPARE] === 'function') {
                descriptor = column[ImageCellComponent.DESCRIPTOR_PREPARE]
                    .call(undefined, this, cell, this.cellRow, this.cellRowData, this.cellColumnConfig);
            } else {
                descriptor = column[ImageCellComponent.DESCRIPTOR_PREPARE] || '';
            }

        } else if (config && Object.keys(config).length
            && config.hasOwnProperty(ImageCellComponent.DESCRIPTOR_PREPARE)) {
            if (typeof config[ImageCellComponent.DESCRIPTOR_PREPARE] === 'function') {
                descriptor = config[ImageCellComponent.DESCRIPTOR_PREPARE]
                    .call(undefined, this, cell, this.cellRow, this.cellRowData, this.cellColumnConfig);
            } else {
                descriptor = config[ImageCellComponent.DESCRIPTOR_PREPARE] || '';
            }
        }
        return descriptor;
    }
}

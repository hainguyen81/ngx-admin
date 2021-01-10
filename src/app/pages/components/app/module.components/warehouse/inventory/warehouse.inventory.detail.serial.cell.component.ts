import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {AbstractCellEditor} from '../../../../smart-table/abstract.cell.editor';
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import {CellComponent} from '@app/types/index';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

/**
 * Smart table warehouse serial/IMEI cell component base on {DefaultEditor}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-smart-table-warehouse-inventory-serial-cell',
    templateUrl: './warehouse.inventory.detail.serial.cell.component.html',
    styleUrls: ['./warehouse.inventory.detail.serial.cell.component.scss'],
})
export class WarehouseInventoryDetailSerialCellComponent extends AbstractCellEditor
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get cellValue(): string[] {
        return super.cellValue as string[];
    }

    get newCellValue(): string[] {
        return super.newCellValue as string[];
    }

    set newCellValue(_value: string[]) {
        super.newCellValue = _value;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryDetailSerialCellComponent} class
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

    ngOnInit(): void {
        super.ngOnInit();

        if (!(this.newCellValue || []).length) {
            this.newCellValue = [];
        }
        // if need to add at least one row
        if (!this.viewMode && this.newCellValue.length < 1) this.addSerial();
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Remove serial at the specified index
     * @param dataIndex to remove
     */
    public removeSerial(dataIndex: number): void {
        const serials: string[] = this.newCellValue;
        if (0 <= dataIndex && dataIndex < (serials || []).length) {
            serials.splice(dataIndex, 1);
        }
    }

    /**
     * Add a new batch at the bottom position
     */
    public addSerial(): void {
        this.newCellValue.push(undefined);
    }
}

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef, forwardRef,
    Host,
    Inject, QueryList,
    Renderer2, ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {isNullOrUndefined} from 'util';
import {Constants} from '../../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import {WarehouseItemFormlySelectExFieldComponent} from './warehouse.item.select.ex.field.component';
import {IWarehouseItem} from '../../../../../../@core/data/warehouse/warehouse.item';
import {AbstractCellEditor} from '../../../../smart-table/abstract.cell.editor';
import ComponentUtils from '../../../../../../utils/component.utils';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';

/**
 * Smart table warehouse item cell component base on {DefaultEditor}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_SETTINGS_BATCH,
    selector: 'ngx-smart-table-warehouse-item-cell',
    templateUrl: './warehouse.item.cell.component.html',
    styleUrls: ['./warehouse.item.cell.component.scss'],
})
export class WarehouseItemCellComponent extends AbstractCellEditor
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(WarehouseItemFormlySelectExFieldComponent)
    private readonly querySelectComponent: QueryList<WarehouseItemFormlySelectExFieldComponent>;
    private _selectComponent: WarehouseItemFormlySelectExFieldComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get selectComponent(): WarehouseItemFormlySelectExFieldComponent {
        return this._selectComponent;
    }

    get isEditable(): boolean {
        return true;
    }

    get valueParser(): (value: any) => any {
        return value => value;
    }

    get valueFormatter(): (value: any) => any {
        return value => {
            if (!isNullOrUndefined(this.selectComponent)) {
                const detectValItem: IWarehouseItem =
                    (this.selectComponent.items || []).find((item: IWarehouseItem) => {
                    return (((isNullOrUndefined(value) || !(value || '').length) && isNullOrUndefined(item))
                        || item.code === value);
                });
                return detectValItem;
            }
            return undefined;
        };
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

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        if (!this._selectComponent) {
            this._selectComponent = ComponentUtils.queryComponent(
                this.querySelectComponent, component => {
                    component && component.refresh();
                });
        }
    }
}

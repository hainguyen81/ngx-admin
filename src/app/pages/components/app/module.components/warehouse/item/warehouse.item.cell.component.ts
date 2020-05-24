import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    Inject,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {AbstractCellEditor} from '../../../../smart-table/abstract.cell.editor';
import ComponentUtils from '../../../../../../utils/component.utils';
import {CellComponent} from 'ng2-smart-table/components/cell/cell.component';
import {WarehouseItemFormlySelectFieldComponent} from './warehouse.item.select.field.component';
import {IEvent} from '../../../../abstract.component';
import {IWarehouseItem} from '../../../../../../@core/data/warehouse/warehouse.item';
import {isArray, isNullOrUndefined} from 'util';
import {
    WarehouseItemDbService,
} from '../../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.service';
import {BehaviorSubject} from 'rxjs';
import PromiseUtils from '../../../../../../utils/promise.utils';
import {NgOption} from '@ng-select/ng-select';

/**
 * Smart table warehouse item cell component base on {DefaultEditor}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-smart-table-warehouse-item-cell',
    templateUrl: './warehouse.item.cell.component.html',
})
export class WarehouseItemCellComponent extends AbstractCellEditor
    implements OnInit, AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(WarehouseItemFormlySelectFieldComponent)
    private readonly querySelectComponent: QueryList<WarehouseItemFormlySelectFieldComponent>;
    private _selectComponent: WarehouseItemFormlySelectFieldComponent;

    private _warehouseItemBehavior: BehaviorSubject<any>;
    private _warehouseItem: IWarehouseItem;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {WarehouseItemFormlySelectFieldComponent} instance
     * @return the {WarehouseItemFormlySelectFieldComponent} instance
     */
    protected get selectComponent(): WarehouseItemFormlySelectFieldComponent {
        return this._selectComponent;
    }

    get warehouseItem(): IWarehouseItem {
        return this._warehouseItem;
    }

    get viewValue(): string {
        return (!isNullOrUndefined(this.warehouseItem)
            ? [this.warehouseItem.name, ' (', this.warehouseItem.code, ')'].join('') : '');
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
     * @param warehouseItemDbService {WarehouseItemDbService}
     */
    constructor(@Inject(forwardRef(() => CellComponent)) _parentCell: CellComponent,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef,
                @Inject(WarehouseItemDbService) private warehouseItemDbService: WarehouseItemDbService) {
        super(_parentCell, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        const _this: WarehouseItemCellComponent = this;
        this.valueParser = (value: any) => {
            // check if multiple selection
            let values: any[] = [];
            if (isArray(value)) {
                values = Array.from(value);
            } else if (!isNullOrUndefined(value)) {
                values = Array.of(value);
            }

            const items: IWarehouseItem[] = [];
            values.forEach(val => {
                let item: IWarehouseItem = val as IWarehouseItem;
                if (!isNullOrUndefined(val) && val.hasOwnProperty('htmlId')) {
                    item = (val as NgOption).value as IWarehouseItem;
                }
                items.push(item);
            });
            return (!items.length || isNullOrUndefined(items[0]) || !(items[0].code || '').length
                ? undefined : items[0].code);
        };
        this.valueFormatter = (value: any) => {
            let retValue: any = value;
            if (!isNullOrUndefined(_this.selectComponent)) {
                retValue = _this.selectComponent.findItems([value]);
            }
            return retValue;
        };
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this._selectComponent && !this.viewMode) {
            this._selectComponent = ComponentUtils.queryComponent(
                this.querySelectComponent, component => {
                    if (component) {
                        component.onLoad.subscribe(e => {
                            component.value = this.cellValue;
                        });
                        component.onBlur.subscribe(($event: IEvent) => {
                            this.control.markAsTouched({ onlySelf: true });
                        });
                        component.onSelect.subscribe(($event: IEvent) => {
                            this.newCellValue = $event.data;
                            this.fireCellChanged($event);
                        });
                        component.refresh();
                    }
                });
        }

        if (this.viewMode) {
            this._warehouseItemBehavior = new BehaviorSubject<any>(this.cellValue);
            this._warehouseItemBehavior.subscribe(value => {
                this._observeCellValue(value);
            });
        }
    }

    ngOnDestroy(): void {
        PromiseUtils.unsubscribe(this._warehouseItemBehavior);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    private _observeCellValue(value: any): void {
        if ((isNullOrUndefined(this._warehouseItem) || ((value || '') !== (this._warehouseItem.code || '')))
            && !isNullOrUndefined(value) && (value || '').length
            && this.viewMode) {
            this.warehouseItemDbService.getAllByIndex('code', IDBKeyRange.only(value))
                .then(items => {
                    this._warehouseItem = (items.length ? items[0] : undefined);
                    this.detectChanges();
                }, reason => this.logger.error(reason))
                .catch(reason => this.logger.error(reason));
        }
    }
}

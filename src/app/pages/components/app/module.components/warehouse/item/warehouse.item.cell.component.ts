import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    Inject,
    OnDestroy,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import {AbstractCellEditor} from '../../../../smart-table/abstract.cell.editor';
import ComponentUtils from '../../../../../../utils/common/component.utils';
import {CellComponent} from '@app/types/index';
import {WarehouseItemFormlySelectFieldComponent} from './warehouse.item.select.field.component';
import {IEvent} from '../../../../abstract.component';
import {IWarehouseItem} from '../../../../../../@core/data/warehouse/warehouse.item';
import {WarehouseItemDbService} from '../../../../../../services/implementation/warehouse/warehouse.item/warehouse.item.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import PromiseUtils from '../../../../../../utils/common/promise.utils';
import ObjectUtils from '../../../../../../utils/common/object.utils';
import FunctionUtils from '../../../../../../utils/common/function.utils';

/**
 * Smart table warehouse item cell component base on {DefaultEditor}
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_ITEM,
    selector: 'ngx-smart-table-warehouse-item-cell',
    templateUrl: './warehouse.item.cell.component.html',
    styleUrls: ['./warehouse.item.cell.component.scss'],
})
export class WarehouseItemCellComponent extends AbstractCellEditor
    implements AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(WarehouseItemFormlySelectFieldComponent)
    private readonly querySelectComponent: QueryList<WarehouseItemFormlySelectFieldComponent>;
    private _selectComponent: WarehouseItemFormlySelectFieldComponent;

    private _warehouseItemBehavior: BehaviorSubject<any>;
    private _warehouseItem: IWarehouseItem;

    private __loadSubscription: Subscription;
    private __blurSubscription: Subscription;
    private __selectSubscription: Subscription;
    private __behaviorSubscription: Subscription;

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

    get images(): string[] {
        return (ObjectUtils.isNotNou(this.warehouseItem) ? this.warehouseItem.image : undefined);
    }

    get viewValue(): string {
        return (ObjectUtils.isNotNou(this.warehouseItem)
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

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this._selectComponent && !this.viewMode) {
            const _this: WarehouseItemCellComponent = this;
            this._selectComponent = ComponentUtils.queryComponent(
                this.querySelectComponent, component => {
                    FunctionUtils.invokeTrue(
                        ObjectUtils.isNou(_this.__loadSubscription),
                        () => this.__loadSubscription = component.onLoad.subscribe((e: any) => component.value = this.cellValue),
                        _this);
                    FunctionUtils.invokeTrue(
                        ObjectUtils.isNou(_this.__blurSubscription),
                        () => this.__blurSubscription = component.onBlur.subscribe(($event: IEvent) => this.control.markAsTouched({ onlySelf: true })),
                        _this);
                    FunctionUtils.invokeTrue(
                        ObjectUtils.isNou(_this.__selectSubscription),
                        () => this.__selectSubscription = component.onSelect.subscribe(($event: IEvent) => {
                            this.newCellValue = $event.data;
                            this.fireCellChanged($event);
                        }), _this);
                    component.refresh();
                });
        }

        if (this.viewMode) {
            this._warehouseItemBehavior = new BehaviorSubject<any>(this.cellValue);
            FunctionUtils.invokeTrue(
                ObjectUtils.isNou(this.__behaviorSubscription),
                () => this.__behaviorSubscription = this._warehouseItemBehavior.subscribe(value => this._observeCellValue(value)),
                this);
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this._warehouseItemBehavior);
        PromiseUtils.unsubscribe(this.__behaviorSubscription);
        PromiseUtils.unsubscribe(this.__loadSubscription);
        PromiseUtils.unsubscribe(this.__blurSubscription);
        PromiseUtils.unsubscribe(this.__selectSubscription);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    private _observeCellValue(value: any): void {
        if ((ObjectUtils.isNou(this._warehouseItem) || ((value || '') !== (this._warehouseItem.code || '')))
            && ObjectUtils.isNotNou(value) && (value || '').length
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

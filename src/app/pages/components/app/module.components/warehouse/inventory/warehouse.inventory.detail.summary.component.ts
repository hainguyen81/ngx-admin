import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, Input,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {Constants as CommonConstants} from '../../../../../../@core/data/constants/common.constants';
import {AbstractComponent} from '../../../../abstract.component';
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {Ng2SmartTableComponent} from 'ng2-smart-table/lib/ng2-smart-table.component';

/**
 * Smart table warehouse summary component
 */
@Component({
    moduleId: CommonConstants.COMMON.MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-smart-table-warehouse-inventory-quantity-summary-cell',
    templateUrl: './warehouse.inventory.detail.summary.component.html',
    styleUrls: ['./warehouse.inventory.detail.summary.component.scss'],
})
export class WarehouseInventoryDetailSummaryComponent extends AbstractComponent
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _tableComponent: Ng2SmartTableComponent;
    private _summaryColumn: number;
    private _currency: boolean;
    private _componentClass: string;
    private _value: number;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    get isCurrency(): boolean {
        return this._currency;
    }

    set isCurrency(_currency: boolean) {
        this._currency = _currency;
    }

    get componentClass(): string {
        return this._componentClass;
    }

    set componentClass(_componentClass: string) {
        this._componentClass = _componentClass;
    }

    get tableComponent(): Ng2SmartTableComponent {
        return this._tableComponent;
    }

    set tableComponent(_tableComponent: Ng2SmartTableComponent) {
        this._tableComponent = _tableComponent;
    }

    get summaryColumn(): number {
        return this._summaryColumn;
    }

    set summaryColumn(_summaryColumn: number) {
        this._summaryColumn = _summaryColumn;
    }

    @Input() get value(): number {
        return (isNaN(this._value) ? undefined : this._value);
    }

    set value(_value: number) {
        this._value = _value;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventoryDetailSumQuantityComponent} class
     * @param dataSource {DataSource}
     * @param contextMenuService {ContextMenuService}
     * @param toasterService {ToastrService}
     * @param logger {NGXLogger}
     * @param renderer {Renderer2}
     * @param translateService {TranslateService}
     * @param factoryResolver {ComponentFactoryResolver}
     * @param viewContainerRef {ViewContainerRef}
     * @param changeDetectorRef {ChangeDetectorRef}
     * @param elementRef {ElementRef}
     * @param modalDialogService {ModalDialogService}
     * @param confirmPopup {ConfirmPopup}
     * @param lightbox {Lightbox}
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
                @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                @Inject(ToastrService) toasterService: ToastrService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(Renderer2) renderer: Renderer2,
                @Inject(TranslateService) translateService: TranslateService,
                @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) elementRef: ElementRef,
                @Inject(ModalDialogService) modalDialogService?: ModalDialogService,
                @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup,
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }
}

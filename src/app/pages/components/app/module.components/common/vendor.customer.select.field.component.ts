import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {Constants as CustomerConstants} from '../../../../../@core/data/constants/customer.constants';
import Customer, {ICustomer} from '../../../../../@core/data/system/customer';
import {
    CustomerDatasource,
} from '../../../../../services/implementation/system/customer/customer.datasource';
import PromiseUtils from '../../../../../utils/common/promise.utils';
import {$enum} from 'ts-enum-util';
import CUSTOMER_TYPE = CustomerConstants.CustomerConstants.CUSTOMER_TYPE;
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../select/abstract.select.component';
import {
    AppModuleDataIndexSettingsFormlySelectFieldComponent,
} from '../../components/common/app.module.data.index.formly.select.field.component';
import ObjectUtils from '../../../../../utils/common/object.utils';

export const VendorCustomerNgxSelectOptions: INgxSelectOptions =
    Object.assign({}, DefaultNgxSelectOptions, {
        /**
         * Provide an opportunity to change the name an id property of objects in the items
         * {string}
         */
        bindValue: 'code',
        /**
         * Provide an opportunity to change the name a text property of objects in the items
         * {string}
         */
        bindLabel: 'text',
        /**
         * Specify whether using image for option
         * {boolean}
         */
        enableImage: true,
    });

/**
 * Custom module formly field for selecting warehouse inventory vendor/customer
 */
@Component({
    selector: 'ngx-select-2-app-module-vendor-customer',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export class VendorCustomerFormlySelectFieldComponent
    extends AppModuleDataIndexSettingsFormlySelectFieldComponent<ICustomer, CustomerDatasource>
    implements OnInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private _vendorCustomerType: string;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    public get vendorCustomerType(): string {
        if (!(this._vendorCustomerType || '').length) {
            this._vendorCustomerType = $enum(CUSTOMER_TYPE).getKeyOrThrow(CUSTOMER_TYPE.ALL);
        }
        return this._vendorCustomerType;
    }

    public set vendorCustomerType(_vendorCustomerType: string) {
        this.vendorCustomerTypeEnum = $enum(CUSTOMER_TYPE).getValueOrThrow(_vendorCustomerType);
    }

    public set vendorCustomerTypeEnum(_vendorCustomerType: CUSTOMER_TYPE) {
        _vendorCustomerType = (_vendorCustomerType || CUSTOMER_TYPE.ALL);
        if (this._vendorCustomerType !== ObjectUtils.any(CUSTOMER_TYPE)[_vendorCustomerType]) {
            this._vendorCustomerType = _vendorCustomerType;
            this.refresh();
        }
    }

    protected get noneOption(): ICustomer {
        const _noneCustomer: ICustomer = new Customer(null, null, null, null);
        ObjectUtils.any(_noneCustomer)['text'] = this.getConfigValue('placeholder');
        return _noneCustomer;
    }

    protected get dataIndexName(): string {
        return '__customer_index_by_type';
    }

    protected get dataIndexKey(): IDBKeyRange {
        return IDBKeyRange.only([this.vendorCustomerType]);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {VendorCustomerFormlySelectFieldComponent} class
     * @param dataSource {CustomerDatasource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(CustomerDatasource) dataSource: CustomerDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this.config = VendorCustomerNgxSelectOptions;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<ICustomer[] | ICustomer>
        | Promise<ICustomer[] | ICustomer> | ICustomer[] | ICustomer {
        const _dataSource: CustomerDatasource = this.dataSource;
        const enumType: CUSTOMER_TYPE = $enum(CUSTOMER_TYPE).getValueOrDefault(
            this.vendorCustomerType, CUSTOMER_TYPE.ALL);
        switch (enumType) {
            case CUSTOMER_TYPE.ALL:
                return PromiseUtils.parallelPromises(
                    [],
                    (result: ICustomer[], value: ICustomer[]) => result = result.concat(value), [
                        SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                            _dataSource, this.dataIndexName,
                            IDBKeyRange.only([$enum(CUSTOMER_TYPE).getKeyOrThrow(CUSTOMER_TYPE.CUSTOMER)]),
                            this.translateService),
                        SystemDataUtils.invokeDatasourceModelsByDatabaseFilterAsDefaultSelectOptions(
                            _dataSource, this.dataIndexName,
                            IDBKeyRange.only([$enum(CUSTOMER_TYPE).getKeyOrThrow(CUSTOMER_TYPE.VENDOR)]),
                            this.translateService),
                    ]);

            default:
                return super.loadData();
        }
    }
}

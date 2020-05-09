import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {AppFormlyComponent} from '../../components/app.formly.component';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import BUILTIN_CODES = CommonConstants.COMMON.BUILTIN_CODES;
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, Validators} from '@angular/forms';
import PromiseUtils from '../../../../../utils/promise.utils';
import AppObserveUtils from '../../../../../utils/app.observe.utils';
import {IGeneralSettings} from '../../../../../@core/data/system/general.settings';
import {
    GeneralSettingsDatasource,
} from '../../../../../services/implementation/system/general.settings/general.settings.datasource';
import moment, {Moment} from 'moment';
import {isNullOrUndefined} from 'util';
import {
    AppFormlyDatePickerFieldComponent,
} from '../../components/common/app.formly.datepicker.field.component';
import {
    IWarehouseInventorySearch,
} from '../../../../../@core/data/warehouse/extension/warehouse.inventory.search';
import {LocalDataSource} from 'ng2-smart-table';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';

/* default warehouse in/out search formly config */
export const WarehouseInventorySearchFormConfig: FormlyConfig = new FormlyConfig();

/* default warehouse in/out search formly fields config */
export const WarehouseInventorySearchFormFieldsConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'warehouse_id',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.inventory.search.form.storage.label',
                    placeholder: 'warehouse.inventory.search.form.storage.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'from',
                type: 'app-date-picker',
                templateOptions: {
                    label: 'warehouse.inventory.search.form.from.label',
                    placeholder: 'warehouse.inventory.search.form.from.placeholder',
                    'config': {
                        mode: 'day',
                        config: {
                            appendTo: document.body,
                            format: 'common.date.dd/mm/yyyy',
                        },
                    },
                    'must_less_equals_to_date': false,
                },
                validators: {
                    'must_less_equals_to_date': {
                        expression: (formControl: AbstractControl, field: FormlyFieldConfig) => {
                            const fieldComponent: AppFormlyDatePickerFieldComponent = formControl['componentRef'];
                            const model: IWarehouseInventorySearch = formControl.root.value;

                            // if data is invalid; then always be valid
                            if (isNullOrUndefined(fieldComponent)
                                || !(fieldComponent.dateTimePattern || '').length
                                || !(model.to || '').length) {
                                return true;
                            }

                            const from_date: Moment = fieldComponent.value;
                            const to_value: Moment = moment(model.to, fieldComponent.dateTimePattern);
                            const valid: boolean = (isNullOrUndefined(from_date)
                                || from_date.isSameOrBefore(to_value, 'd'));
                            if (valid && field.form && field.form.controls
                                && field.form.controls.hasOwnProperty('to')
                                && field.form.controls['to'].invalid) {
                                field.form.controls['to']
                                    .updateValueAndValidity({ onlySelf: true, emitEvent: true });
                            }
                            return valid;
                        },
                        message: 'warehouse.inventory.search.form.from.must_less_equals_to_date',
                    },
                },
            },
            {
                className: 'col-4',
                key: 'to',
                type: 'app-date-picker',
                templateOptions: {
                    label: 'warehouse.inventory.search.form.to.label',
                    placeholder: 'warehouse.inventory.search.form.to.placeholder',
                    'config': {
                        mode: 'day',
                        config: {
                            appendTo: document.body,
                            format: 'common.date.dd/mm/yyyy',
                        },
                    },
                    'must_greater_equals_from_date': false,
                },
                validators: {
                    'must_greater_equals_from_date': {
                        expression: (formControl: AbstractControl, field: FormlyFieldConfig) => {
                            const fieldComponent: AppFormlyDatePickerFieldComponent = formControl['componentRef'];
                            const model: IWarehouseInventorySearch = formControl.root.value;

                            // if data is invalid; then always be valid
                            if (isNullOrUndefined(fieldComponent)
                                || !(fieldComponent.dateTimePattern || '').length
                                || !(model.from || '').length) {
                                return true;
                            }

                            const to_date: Moment = fieldComponent.value;
                            const from_value: Moment = moment(model.from, fieldComponent.dateTimePattern);
                            const valid: boolean = (isNullOrUndefined(to_date)
                                || to_date.isSameOrAfter(from_value, 'd'));
                            if (valid && field.form && field.form.controls
                                && field.form.controls.hasOwnProperty('from')
                                && field.form.controls['from'].invalid) {
                                field.form.controls['from']
                                    .updateValueAndValidity({ onlySelf: true, emitEvent: true });
                            }
                            return valid;
                        },
                        message: 'warehouse.inventory.search.form.to.must_greater_equals_from_date',
                    },
                },
            },
        ],
    },
    {
        fieldGroupClassName: 'row ml-0 mr-0',
        fieldGroup: [
            {
                className: 'col-4',
                key: 'custom_id',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.inventory.search.form.customer.label',
                    placeholder: 'warehouse.inventory.search.form.customer.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'type',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.inventory.search.form.type.label',
                    placeholder: 'warehouse.inventory.search.form.type.placeholder',
                },
            },
            {
                className: 'col-4',
                key: 'keyword',
                type: 'input',
                templateOptions: {
                    label: 'warehouse.inventory.search.form.keyword.label',
                    placeholder: 'warehouse.inventory.search.form.keyword.placeholder',
                },
            },
        ],
    },
];

/**
 * Form component base on {FormlyModule}
 */
@Component({
    moduleId: MODULE_CODES.WAREHOUSE_FEATURES_INVENTORY,
    selector: 'ngx-formly-form-app-warehouse-inventory-search',
    templateUrl: '../../../formly/formly.component.html',
    styleUrls: [
        '../../../formly/formly.component.scss',
        '../../components/app.formly.component.scss',
    ],
})
export class WarehouseInventorySearchFormlyComponent
    extends AppFormlyComponent<IWarehouseInventorySearch, DataSource>
    implements OnInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {WarehouseInventorySearchFormlyComponent} class
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
     * @param generalSettingsDatasource {GeneralSettingsDatasource}
     */
    constructor(@Inject(DataSource) dataSource: LocalDataSource,
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(GeneralSettingsDatasource) private generalSettingsDatasource?: GeneralSettingsDatasource) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        super.config = WarehouseInventorySearchFormConfig;
        super.fields = WarehouseInventorySearchFormFieldsConfig;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        super.ngOnInit();

        // observer fields for applying values
        const fields: FormlyFieldConfig[] = this.fields;
        PromiseUtils.parallelPromises(undefined, undefined, [
            AppObserveUtils.observeDefaultSystemGeneralSettingsFormField(
                this.generalSettingsDatasource, fields[4].fieldGroup[0],
                BUILTIN_CODES.STATUS.code,
                null, this.noneOption as IGeneralSettings),
        ]).then(value => this.getLogger().debug('Loading general settings successful'),
            reason => this.getLogger().error(reason))
            .catch(reason => this.getLogger().error(reason));
    }
}

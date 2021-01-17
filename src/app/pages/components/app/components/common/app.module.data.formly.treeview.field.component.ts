import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {IModel} from '../../../../../@core/data/base';
import {AppTreeviewI18n, TOKEN_APP_TREEVIEW_SHOW_ALL} from '../app.treeview.i18n';
import {TreeviewI18n} from 'ngx-treeview';
import {TranslateService} from '@ngx-translate/core';
import {AppFormlyTreeviewDropdownFieldComponent} from './app.formly.treeview.dropdown.field.component';
import {BaseDataSource} from '../../../../../services/common/datasource.service';
import {IDbService, IHttpService} from '../../../../../services/common/interface.service';
import {DataSource} from '@app/types/index';
import {NGXLogger} from 'ngx-logger';
import {isObservable, Observable, Subscription, throwError} from 'rxjs';
import {isPromise} from 'rxjs/internal-compatibility';
import ObjectUtils from '../../../../../utils/common/object.utils';
import ArrayUtils from '../../../../../utils/common/array.utils';
import TimerUtils from 'app/utils/common/timer.utils';
import FunctionUtils from 'app/utils/common/function.utils';
import PromiseUtils from 'app/utils/common/promise.utils';

/**
 * Custom formly field for selecting tree
 */
@Component({
    selector: 'ngx-formly-treeview-dropdown-app-module-data',
    templateUrl: '../../../formly/formly.treeview.dropdown.field.component.html',
    styleUrls: ['../../../formly/formly.treeview.dropdown.field.component.scss'],
    providers: [
        {
            provide: TOKEN_APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: AppTreeviewI18n,
            deps: [TranslateService, TOKEN_APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export class AppModuleDataFormlyTreeviewFieldComponent<
    M extends IModel, D extends BaseDataSource<M, IHttpService<M>, IDbService<M>>>
    extends AppFormlyTreeviewDropdownFieldComponent<M>
    implements OnInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    private __formValueChangesSubscription: Subscription;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get dataSource(): D {
        return this._dataSource;
    }

    /**
     * Get the value of node that need to disable
     * @return value of node to disable or undefined to ignore
     */
    protected get disableValue(): any {
        return undefined;
    }

    /**
     * Get a boolean value indicating the {#disableValue} whether should be disabled if valid value
     * @return true for should be disabled; else false
     */
    protected get shouldDisableValue(): boolean {
        return true;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppModuleDataIndexFormlyTreeviewFieldComponent} class
     * @param _dataSource {DataSource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(DataSource) private _dataSource: D,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this._dataSource || throwError('Could not inject DataSource instance');
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit() {
        super.ngOnInit();

        // load data
        this.refresh();

        FunctionUtils.invoke(
            ObjectUtils.isNotNou(this.field) && ObjectUtils.isNotNou(this.field.form),
            () => this.__formValueChangesSubscription = this.field.form.valueChanges.subscribe(subscriber => {
                if (this.shouldDisableValue) {
                    TimerUtils.timeout(() => {
                        const disabledItemValue: any = this.disableValue;
                        ObjectUtils.isNotNou(disabledItemValue) && this.disableItemsByValue(disabledItemValue);
                    }, 100, this);
                }
            }), undefined, this);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__formValueChangesSubscription);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Refresh data
     */
    public refresh(): void {
        const _loadData: Observable<M | M[]> | Promise<M | M[]> | (M | M[]) = this.loadData();

        // promise data
        if (ObjectUtils.isNotNou(_loadData) && isPromise(_loadData)) {
            (<Promise<M | M[]>>_loadData).then(
                data => this.loadDataInternal(data),
                reason => this.logger.error(reason))
                .catch(reason => this.logger.error(reason));

            // observe data
        } else if (ObjectUtils.isNotNou(_loadData) && isObservable(_loadData)) {
            (<Observable<M | M[]>>_loadData).subscribe(
                data => this.loadDataInternal(data)).unsubscribe();

        } else if (ObjectUtils.isNotNou(_loadData)) {
            this.loadDataInternal(<M | M[]>_loadData);
        }
    }

    /**
     * Abstract method to load data into select
     * TODO Children classes should override this method for loading data at start-up
     */
    protected loadData(): Observable<M | M[]> | Promise<M | M[]> | (M | M[]) {
        return null;
    }

    /**
     * Internal apply data items
     * @param data to apply
     */
    private loadDataInternal(data: M | M[]): void {
        let items: M[] = [];
        if (ObjectUtils.isNotNou(data) && ArrayUtils.isArray(data)) {
            items = [].concat(data as M[]);

        } else if (ObjectUtils.isNotNou(data)) {
            items = [data as M];
        }
        super.buildTemplateOptionsToTree(items);

        // select current field value and disable node if necessary
        const fieldValue: any = this.value;
        super.setSelectedValue(fieldValue, false);
        if (this.shouldDisableValue) {
            const disabledItemValue: any = this.disableValue;
            ObjectUtils.isNotNou(disabledItemValue) && this.disableItemsByValue(disabledItemValue);
        }
    }
}

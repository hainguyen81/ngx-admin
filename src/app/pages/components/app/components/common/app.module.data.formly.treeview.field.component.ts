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
import {IModel} from '../../../../../@core/data/base';
import {AppTreeviewI18n, TOKEN_APP_TREEVIEW_SHOW_ALL} from '../app.treeview.i18n';
import {TreeviewI18n} from 'ngx-treeview';
import {TranslateService} from '@ngx-translate/core';
import {
    AppFormlyTreeviewDropdownFieldComponent,
} from './app.formly.treeview.dropdown.field.component';
import {BaseDataSource} from '../../../../../services/common/datasource.service';
import {IDbService, IHttpService} from '../../../../../services/common/interface.service';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {NGXLogger} from 'ngx-logger';
import {isObservable, Observable, throwError} from 'rxjs';
import {isArray, isNullOrUndefined} from 'util';
import {isPromise} from 'rxjs/internal-compatibility';

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
    implements OnInit {

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

        this.field && this.field.form
        && this.field.form.valueChanges.subscribe(subscriber => {
            if (this.shouldDisableValue) {
                const timer: number = window.setTimeout(() => {
                    const disabledItemValue: any = this.disableValue;
                    !isNullOrUndefined(disabledItemValue) && this.disableItemsByValue(disabledItemValue);
                    window.clearTimeout(timer);
                }, 100);
            }
        });
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
        if (!isNullOrUndefined(_loadData) && isPromise(_loadData)) {
            (<Promise<M | M[]>>_loadData).then(
                data => this.loadDataInternal(data),
                reason => this.logger.error(reason))
                .catch(reason => this.logger.error(reason));

            // observe data
        } else if (!isNullOrUndefined(_loadData) && isObservable(_loadData)) {
            (<Observable<M | M[]>>_loadData).subscribe(
                data => this.loadDataInternal(data));

        } else if (!isNullOrUndefined(_loadData)) {
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
        if (!isNullOrUndefined(data) && isArray(data)) {
            items = [].concat(data as M[]);

        } else if (!isNullOrUndefined(data)) {
            items = [data as M];
        }
        super.buildTemplateOptionsToTree(items);

        // select current field value and disable node if necessary
        const fieldValue: any = this.value;
        super.setSelectedValue(fieldValue, false);
        if (this.shouldDisableValue) {
            const disabledItemValue: any = this.disableValue;
            !isNullOrUndefined(disabledItemValue) && this.disableItemsByValue(disabledItemValue);
        }
    }
}

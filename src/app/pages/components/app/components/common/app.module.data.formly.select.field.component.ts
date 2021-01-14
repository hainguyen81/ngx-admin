import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Inject, OnInit, Output, Renderer2, ViewContainerRef,} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {IModel} from '../../../../../@core/data/base';
import {DataSource} from '@app/types/index';
import {isObservable, Observable, throwError} from 'rxjs';
import {isPromise} from 'rxjs/internal-compatibility';
import {AppFormlySelectFieldComponent} from './app.formly.select.field.component';
import ObjectUtils from '../../../../../utils/common/object.utils';
import ArrayUtils from '../../../../../utils/common/array.utils';

/**
 * Custom module data formly field for selecting special
 */
@Component({
    selector: 'ngx-formly-select-app-module-data',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export class AppModuleDataFormlySelectFieldComponent<
    M extends IModel, D extends DataSource>
    extends AppFormlySelectFieldComponent<M>
    implements OnInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @Output() readonly onLoad: EventEmitter<any> = new EventEmitter(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get a boolean value indicating the select component whether loads data automatically on start-up
     * @return true for loading; else false
     */
    protected get autoLoadOnStartup(): boolean {
        return true;
    }

    protected get dataSource(): D {
        return this._datasource;
    }

    protected get noneOption(): M {
        return undefined;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppModuleDataSettingsFormlySelectExFieldComponent} class
     * @param _datasource {DataSource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(DataSource) private _datasource: D,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this._datasource || throwError('Could not inject DataSource instance');
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        this.autoLoadOnStartup && this.refresh();
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
                data => this.loadDataInternal(data));

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
    protected loadDataInternal(data: M | M[]): void {
        const defaultOpt: M = this.noneOption;
        let items: M[] = [];
        if (ObjectUtils.isNotNou(data)) {
            if (ArrayUtils.isArray(data)) {
                items = (ObjectUtils.isNou(defaultOpt) ? [] : [defaultOpt]).concat(data as M[]);

            } else {
                items = (ObjectUtils.isNou(defaultOpt) ? [] : [defaultOpt]).concat([data as M]);
            }
        }
        this.items = items;
        this.onLoad.emit();
    }
}
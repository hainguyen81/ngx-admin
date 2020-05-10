import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Inject,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {AppFormlySelectExFieldComponent} from '../common/app.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {NGXLogger} from 'ngx-logger';
import {IModel} from '../../../../../@core/data/base';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {isArray, isNullOrUndefined} from 'util';
import {IEvent} from '../../../abstract.component';
import {throwError} from 'rxjs';

/**
 * Custom module data formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-module-data',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export abstract class AppModuleDataSettingsFormlySelectExFieldComponent<M extends IModel, D extends DataSource>
    extends AppFormlySelectExFieldComponent<M>
    implements OnInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    onChange: EventEmitter<IEvent> = new EventEmitter<IEvent>(true);

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

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
     * @param datasource {DataSource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     * @param _config select configuration
     */
    protected constructor(@Inject(DataSource) private _datasource: D,
                          @Inject(TranslateService) _translateService: TranslateService,
                          @Inject(Renderer2) _renderer: Renderer2,
                          @Inject(NGXLogger) _logger: NGXLogger,
                          @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                          @Inject(ElementRef) _elementRef: ElementRef,
                          _config?: INgxSelectExOptions | null) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this._datasource || throwError('Could not inject DataSource instance');
        _config || throwError('Configuration must be required');
        this.config = _config;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        const _this: AppModuleDataSettingsFormlySelectExFieldComponent<M, D> = this;
        const promiseData: Promise<M | M[]> = this.loadData();
        if (!isNullOrUndefined(promiseData)) {
            promiseData.then(value => {
                const defaultOpt: M = this.noneOption;
                let items: M[] = [];
                if (isArray(value)) {
                    items = (isNullOrUndefined(defaultOpt) ? [] : [defaultOpt]).concat(value as M[]);

                } else if (!isNullOrUndefined(value)) {
                    items = (isNullOrUndefined(defaultOpt) ? [] : [defaultOpt]).concat([value as M]);
                }
                _this.items = items;
            }, reason => this.logger.error(reason))
                .catch(reason => this.logger.error(reason));
        }
    }

    protected onSelect($event: IEvent): void {
        super.onSelect($event);
        this.onChange.emit({
            data: {
                'control': this,
                'selectedValues': this.selectedValues,
                'field': this.field,
            },
        });
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Abstract method to load data into select
     */
    protected abstract loadData(): Promise<M | M[]>;
}

import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription, throwError} from 'rxjs';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {NGXLogger} from 'ngx-logger';
import Module, {IModule} from '../../../../../@core/data/system/module';
import {ModuleDatasource} from '../../../../../services/implementation/module.service';
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../select/abstract.select.component';
import {AppFormlySelectFieldComponent} from './app.formly.select.field.component';
import FunctionUtils from '../../../../../utils/common/function.utils';
import ObjectUtils from '../../../../../utils/common/object.utils';
import PromiseUtils from '../../../../../utils/common/promise.utils';

export const AppModulesNgxSelectOptions: INgxSelectOptions = Object.assign({}, DefaultNgxSelectOptions, {
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
    enableImage: false,
});

/**
 * Custom module formly field for selecting special
 */
@Component({
    selector: 'ngx-select-2-app-module',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export class AppModuleFormlySelectFieldComponent
    extends AppFormlySelectFieldComponent<IModule>
    implements OnInit, OnDestroy {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    private __dataSourceChangedSubscription: Subscription;

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param moduleDataSource {ModuleDatasource}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(ModuleDatasource) private moduleDataSource: ModuleDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        moduleDataSource || throwError('Could not inject ModuleDatasource instance');
        this.config = AppModulesNgxSelectOptions;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__dataSourceChangedSubscription),
            () => this.__dataSourceChangedSubscription = this.moduleDataSource.onChanged().subscribe(value => {
                SystemDataUtils.invokeAllModelsAsDefaultSelectOptions(
                    this.moduleDataSource, this.translateService).then(modules => {
                        let noneModule: IModule;
                        noneModule = new Module(null, null, null, null);
                        noneModule['text'] = this.getConfigValue('placeholder');
                        this.items = [noneModule].concat(modules as IModule[]);
                    });
            }), this);
        this.moduleDataSource.refresh();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__dataSourceChangedSubscription);
    }
}

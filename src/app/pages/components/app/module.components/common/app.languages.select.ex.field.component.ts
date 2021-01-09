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
import {
    AppModuleDataFormlySelectExFieldComponent,
} from '../../components/common/app.module.data.formly.select.ex.field.component';
import BaseModel, {IModel} from '../../../../../@core/data/base';
import {DataSource} from 'ng2-smart-table/lib/lib/data-source/data-source';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {DefaultNgxSelectExOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {LocalDataSource} from 'ng2-smart-table';
import {Observable, of} from 'rxjs';
import {AppConfig} from '../../../../../config/app.config';
import {IdGenerators} from '../../../../../config/generator.config';

export const AppLanguagesSelectOptions: INgxSelectExOptions =
    Object.assign({}, DefaultNgxSelectExOptions, {
        /**
         * Provide an opportunity to change the name an id property of objects in the items
         * {string}
         */
        optionValueField: 'value',
        /**
         * Provide an opportunity to change the name a text property of objects in the items
         * {string}
         */
        optionTextField: 'label',
        /**
         * Specify whether using image for option
         * {boolean}
         */
        enableOptionImage: false,
    });

/**
 * Custom module formly field for selecting application supported languages
 */
@Component({
    selector: 'ngx-select-ex-app-languages',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppLanguagesFormlySelectExFieldComponent
    extends AppModuleDataFormlySelectExFieldComponent<IModel, DataSource>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get noneOption(): IModel {
        return new BaseModel(null);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppLanguagesFormlySelectExFieldComponent} class
     * @param dataSource {DataSource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(DataSource) dataSource: LocalDataSource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
        this.config = AppLanguagesSelectOptions;
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected loadData(): Observable<IModel[] | IModel>
        | Promise<IModel[] | IModel> | IModel[] | IModel {
        const languages: { value: string, label: string, code: string, id: string }[] = [];
        (AppConfig.i18n.languages || []).forEach(language => {
            languages.push({
                value: language,
                label: this.translate(['common.languages.', language].join('')),
                code: language,
                id: IdGenerators.oid.generate(),
            });
        });
        return of(languages);
    }
}

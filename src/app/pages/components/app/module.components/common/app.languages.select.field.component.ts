import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnInit, Renderer2, ViewContainerRef,} from '@angular/core';
import BaseModel, {IModel} from '../../../../../@core/data/base';
import {DataSource, LocalDataSource} from '@app/types/index';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {Observable, of} from 'rxjs';
import {AppConfig} from '../../../../../config/app.config';
import {IdGenerators} from '../../../../../config/generator.config';
import {DefaultNgxSelectOptions, INgxSelectOptions} from '../../../select/abstract.select.component';
import {AppModuleDataFormlySelectFieldComponent} from '../../components/common/app.module.data.formly.select.field.component';

export const AppLanguagesNgxSelectOptions: INgxSelectOptions =
    Object.assign({}, DefaultNgxSelectOptions, {
        /**
         * Provide an opportunity to change the name an id property of objects in the items
         * {string}
         */
        bindValue: 'value',
        /**
         * Provide an opportunity to change the name a text property of objects in the items
         * {string}
         */
        bindLabel: 'label',
        /**
         * Specify whether using image for option
         * {boolean}
         */
        enableImage: false,
    });

/**
 * Custom module formly field for selecting application supported languages
 */
@Component({
    selector: 'ngx-select-2-app-languages',
    templateUrl: '../../../formly/formly.select.field.component.html',
    styleUrls: ['../../../formly/formly.select.field.component.scss'],
})
export class AppLanguagesFormlySelectFieldComponent
    extends AppModuleDataFormlySelectFieldComponent<IModel, DataSource>
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
        this.config = AppLanguagesNgxSelectOptions;
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

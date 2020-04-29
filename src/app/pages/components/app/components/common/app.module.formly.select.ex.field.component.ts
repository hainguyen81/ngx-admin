import {AfterViewInit, Component, Inject, OnInit, Renderer2} from '@angular/core';
import {AppFormlySelectExFieldComponent} from './app.formly.select.ex.field.component';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';
import {CountryDatasource} from '../../../../../services/implementation/system/country/country.datasource';
import SystemDataUtils from '../../../../../utils/system/system.data.utils';
import {DefaultNgxSelectOptions, INgxSelectExOptions} from '../../../select-ex/abstract.select.ex.component';
import {NGXLogger} from 'ngx-logger';
import Module, {IModule} from '../../../../../@core/data/system/module';
import {ModuleDatasource} from '../../../../../services/implementation/module.service';

export const AppModulesSelectOptions: INgxSelectExOptions = Object.assign({}, DefaultNgxSelectOptions, {
    /**
     * Provide an opportunity to change the name an id property of objects in the items
     * {string}
     */
    optionValueField: 'code',
    /**
     * Provide an opportunity to change the name a text property of objects in the items
     * {string}
     */
    optionTextField: 'text',
    /**
     * Specify whether using image for option
     * {boolean}
     */
    enableOptionImage: true,
});

/**
 * Custom module formly field for selecting special
 */
@Component({
    selector: 'ngx-select-ex-app-module',
    templateUrl: '../../../formly/formly.select.ex.field.component.html',
    styleUrls: ['../../../formly/formly.select.ex.field.component.scss'],
})
export class AppModuleFormlySelectExFieldComponent
    extends AppFormlySelectExFieldComponent<IModule>
    implements OnInit, AfterViewInit {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlySelectExFieldComponent} class
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param countryDataSource {CountryDatasource}
     * @param _logger {NGXLogger}
     */
    constructor(@Inject(ModuleDatasource) private moduleDataSource: ModuleDatasource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger) {
        super(_translateService, _renderer, _logger);
        moduleDataSource || throwError('Could not inject ModuleDatasource instance');
        super.setConfig(AppModulesSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit(): void {
        this.moduleDataSource.onChanged().subscribe(value => {
            SystemDataUtils.invokeAllModelsAsDefaultSelectOptions(
                this.moduleDataSource, this.translateService).then(modules => {
                    let noneModule: IModule;
                    noneModule = new Module(null, null, null, null);
                    noneModule['text'] = this.getConfig().placeholder;
                    this.setItems([noneModule].concat(modules as IModule[]));
                });
        });
        this.moduleDataSource.refresh();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        super.selectExComponent
        && super.selectExComponent.setEnabledItemImage(false);
    }

    protected valueFormatter(value: any): any {
        let options: any[];
        options = this.getItems().filter(opt => {
            return (opt && ((opt === value) || (opt[this.getConfig().optionValueField] === value)));
        });
        return options || [];
    }
}

import {TreeviewI18n, TreeviewI18nDefault, TreeviewSelection} from 'ngx-treeview';
import {IOrganization} from '../../../../../@core/data/system/organization';
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Injectable,
    OnInit,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TOKEN_APP_TREEVIEW_SHOW_ALL} from '../../components/app.treeview.i18n';
import {NGXLogger} from 'ngx-logger';
import {Constants as CommonConstants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = CommonConstants.COMMON.MODULE_CODES;
import {OrganizationDataSource} from '../../../../../services/implementation/system/organization/organization.datasource';
import {
    AppModuleDataIndexFormlyTreeviewFieldComponent,
} from '../../components/common/app.module.data.index.formly.treeview.field.component';
import {Observable} from 'rxjs';
import OrganizationUtils from '../../../../../utils/system/organization.utils';

/**
 * Multi language for treeview field
 */
@Injectable()
export class OrganizationTreeviewI18n extends TreeviewI18nDefault {

    constructor(@Inject(TranslateService) private translateService: TranslateService,
                @Inject(TOKEN_APP_TREEVIEW_SHOW_ALL) private showAll?: boolean | true) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if ((!selection || !(selection.uncheckedItems || []).length) && this.showAll) {
            if (selection && (selection.checkedItems || []).length) {
                return this.getAllCheckboxText();
            } else {
                return '';
            }
        }

        switch (selection.checkedItems.length) {
            case 0:
                return (this.translateService ? this.translateService.instant(
                    'system.organization.form.belongTo.not_selection') : 'Select organization');
            case 1:
                return selection.checkedItems[0].text;
            default:
                return `${selection.checkedItems.length} organization selected`;
        }
    }

    getAllCheckboxText(): string {
        return (this.translateService ? this.translateService.instant(
            'system.organization.form.belongTo.all_selection') : 'All organization');
    }

    getFilterPlaceholder(): string {
        return (this.translateService ? this.translateService.instant(
            'system.organization.form.belongTo.filter') : 'Filter');
    }

    getFilterNoItemsFoundText(): string {
        return (this.translateService ? this.translateService.instant(
            'system.organization.form.belongTo.not_found') : 'No organization found');
    }

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return (this.translateService ? this.translateService.instant(
            isCollapse ? 'system.organization.form.belongTo.expand'
                : 'system.organization.form.belongTo.collapse')
            : isCollapse ? 'Expand' : 'Collapse');
    }
}

/**
 * Custom organization formly field for selecting parent organization
 */
@Component({
    moduleId: MODULE_CODES.SYSTEM_ORGANIZATION,
    selector: 'ngx-formly-treeview-dropdown-app-module-data-index-organization',
    templateUrl: '../../../formly/formly.treeview.dropdown.field.component.html',
    styleUrls: ['../../../formly/formly.treeview.dropdown.field.component.scss'],
    providers: [
        {
            provide: TOKEN_APP_TREEVIEW_SHOW_ALL, useValue: false,
            multi: true,
        },
        {
            provide: TreeviewI18n, useClass: OrganizationTreeviewI18n,
            deps: [TranslateService, TOKEN_APP_TREEVIEW_SHOW_ALL],
        },
    ],
})
export class OrganizationFormlyTreeviewFieldComponent
    extends AppModuleDataIndexFormlyTreeviewFieldComponent<IOrganization, OrganizationDataSource>
    implements OnInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get isEnabledItemImage(): boolean {
        return false;
    }

    protected get dataIndexKey(): IDBKeyRange {
        return undefined;
    }

    protected get dataIndexName(): string {
        return '';
    }

    protected get disableValue(): any {
        return (this.field ? this.field.model : undefined);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {OrganizationFormlyTreeviewFieldComponent} class
     * @param _dataSource {OrganizationDataSource}
     * @param _translateService {TranslateService}
     * @param _renderer {Renderer2}
     * @param _logger {NGXLogger}
     * @param _factoryResolver {ComponentFactoryResolver}
     * @param _viewContainerRef {ViewContainerRef}
     * @param _changeDetectorRef {ChangeDetectorRef}
     * @param _elementRef {ElementRef}
     */
    constructor(@Inject(OrganizationDataSource) _dataSource: OrganizationDataSource,
                @Inject(TranslateService) _translateService: TranslateService,
                @Inject(Renderer2) _renderer: Renderer2,
                @Inject(NGXLogger) _logger: NGXLogger,
                @Inject(ComponentFactoryResolver) _factoryResolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) _viewContainerRef: ViewContainerRef,
                @Inject(ChangeDetectorRef) _changeDetectorRef: ChangeDetectorRef,
                @Inject(ElementRef) _elementRef: ElementRef) {
        super(_dataSource, _translateService, _renderer, _logger,
            _factoryResolver, _viewContainerRef, _changeDetectorRef, _elementRef);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngOnInit() {
        if (this.field) {
            this.field.templateOptions = (this.field.templateOptions || {});
            this.field.templateOptions['treeBuilder'] = OrganizationUtils.buildOrganization;
        }

        super.ngOnInit();
    }

    protected loadData(): Observable<IOrganization[] | IOrganization>
        | Promise<IOrganization[] | IOrganization> | IOrganization[] | IOrganization {
        return this.dataSource.setPaging(1, undefined, false)
            .setFilter([], false, false)
            .getAll();
    }
}
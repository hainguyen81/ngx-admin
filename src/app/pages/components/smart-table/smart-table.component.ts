import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from '@app/types/index';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {AbstractSmartTableComponent} from './abstract.smart-table.component';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import ComponentUtils from '../../../utils/common/component.utils';
import {Ng2SmartTableComponent} from 'app/@types/index';
import ObjectUtils from 'app/utils/common/object.utils';
import NumberUtils from 'app/utils/common/number.utils';

/**
 * Smart table base on {Ng2SmartTableComponent}
 */
@Component({
    selector: 'ngx-smart-table',
    templateUrl: './smart-table.component.html',
    styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent extends AbstractSmartTableComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren('searchHolder', {read: ViewContainerRef})
    private readonly querySearchViewContainerRef: QueryList<ViewContainerRef>;
    private _searchViewContainerRef: ViewContainerRef;

    @ViewChildren(Ng2SmartTableComponent)
    private readonly querySmartTableComponent: QueryList<Ng2SmartTableComponent>;
    private smartTableComponent: Ng2SmartTableComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the internal smart table component
     * @return the internal smart table component
     */
    protected get tableComponent(): Ng2SmartTableComponent {
        return this.smartTableComponent;
    }

    /**
     * Get a boolean value indicating whether showing panel header
     * @return true (default) for showing; else false
     */
    get isShowHeader(): boolean {
        return true;
    }

    /**
     * Get a boolean value indicating whether showing panel search
     * @return true (default) for showing; else false
     */
    get isShowSearch(): boolean {
        return false;
    }

    /**
     * Get the {ViewContainerRef} instance of search components panel
     * @return the {ViewContainerRef} instance of search components panel
     */
    protected get searchViewContainerComponent(): ViewContainerRef {
        return this._searchViewContainerRef;
    }

    /**
     * Get the number of the {ViewContainerRef} instance of search components panel
     * @return the number of the {ViewContainerRef} instance of search components panel
     */
    get numberOfSearchComponents(): number {
        return (this.searchViewContainerComponent ? this.searchViewContainerComponent.length : 0);
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {SmartTableComponent} class
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
     */
    constructor(@Inject(DataSource) dataSource: DataSource,
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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    doSearch(keyword: any): void {
        this.getLogger().debug('doSearch', keyword);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.smartTableComponent) {
            this.smartTableComponent = ComponentUtils.queryComponent(
                this.querySmartTableComponent,
                component => component && this.__detectForTableFooter());
        }
        if (!this._searchViewContainerRef) {
            this._searchViewContainerRef = ComponentUtils.queryComponent(this.querySearchViewContainerRef);
        }
        console.log([
            'querySmartTableComponent', this.querySmartTableComponent,
            'smartTableComponent', this.smartTableComponent,
        ]);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Detect settings for table footer
     */
    private __detectForTableFooter(): void {
        const settings: any = this.config;
        const footerSettings: any = (ObjectUtils.isNotNou(settings)
        && settings.hasOwnProperty('footer') ? settings['footer'] : undefined);
        const footerRow: string = <string>(ObjectUtils.isNotNou(footerSettings)
        && footerSettings.hasOwnProperty('rows') && NumberUtils.isNumber(footerSettings['rows'])
            ? footerSettings['rows'] : '0');
        const rowsNumber: number = parseInt(footerRow, 10);
        if (rowsNumber > 0) {
            const innerTable: HTMLTableElement = this.getFirstElementBySelector(
                AbstractSmartTableComponent.SMART_TABLE_SELETOR,
                this.getElementRef().nativeElement) as HTMLTableElement;
            // check to delete footer and create new while changing table settings
            if (ObjectUtils.isNotNou(innerTable)) {
                innerTable.deleteTFoot();
            }

            // create new settings
            const innerFooter: HTMLTableSectionElement =
                (ObjectUtils.isNotNou(innerTable)  ? innerTable.createTFoot() : undefined);
            if (ObjectUtils.isNotNou(innerFooter)) {
                this.tableFooterRows.clear();
                for (let i: number = 0; i < rowsNumber; i++) {
                    this.tableFooterRows.push(innerFooter.insertRow(i));
                }
                this.tableFooterRows.length
                && this.footerCreation.emit({ data: this.tableFooterRows });
            }
        }
    }
}

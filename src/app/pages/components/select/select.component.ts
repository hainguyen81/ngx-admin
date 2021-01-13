import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject, QueryList,
    Renderer2, ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from '@app/types/index';
import {
    AbstractSelectComponent,
    DefaultNgxSelectOptions,
} from './abstract.select.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {NgSelectComponent, NgSelectConfig} from '@ng-select/ng-select';
import ComponentUtils from 'app/utils/common/component.utils';
import ObjectUtils from 'app/utils/common/object.utils';

/**
 * Select component base on {NgSelectComponent}
 */
@Component({
    selector: 'ngx-select-2',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [{
        provide: NgSelectConfig, useValue: DefaultNgxSelectOptions,
        multi: true,
    }],
})
export class NgxSelectComponent extends AbstractSelectComponent<DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(NgSelectComponent)
    private readonly queryNgSelectComponent: QueryList<NgSelectComponent>;
    private ngSelectComponent: NgSelectComponent;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {NgSelectComponent} component
     * @return the {NgSelectComponent} component
     */
    protected get selectComponent(): NgSelectComponent {
        return this.ngSelectComponent;
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractSelectComponent} class
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
            router, activatedRoute,
            DefaultNgxSelectOptions);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.ngSelectComponent) {
            const _this: NgxSelectComponent = this;
            this.ngSelectComponent = ComponentUtils.queryComponent(
                this.queryNgSelectComponent, component => {
                    if (ObjectUtils.isNotNou(component)) {
                        component[AbstractSelectComponent.NG_SELECT_PARENT_COMPONENT_REF_PROPERTY] = _this;
                        component.addEvent.subscribe(addedItem => {
                            this.onAdd({ data: addedItem });
                        });
                        component.blurEvent.subscribe($event => {
                            this.onBlur({ event: $event });
                        });
                        component.changeEvent.subscribe(model => {
                            this.onChange({ data: model });
                        });
                        component.closeEvent.subscribe($event => {
                            this.onClose({ event: $event });
                        });
                        component.clearEvent.subscribe($event => {
                            this.onClear({ event: $event });
                        });
                        component.focusEvent.subscribe($event => {
                            this.onFocus({ event: $event });
                        });
                        component.searchEvent.subscribe(data => {
                            this.onSearch({ data: data });
                        });
                        component.searchEvent.subscribe(data => {
                            this.onSearch({ data: data });
                        });
                        component.openEvent.subscribe($event => {
                            this.onOpen({ event: $event });
                        });
                        component.removeEvent.subscribe(removedItem => {
                            this.onRemove({ data: removedItem });
                        });
                        component.scroll.subscribe(data => {
                            this.onScroll({ data: data });
                        });
                        component.scrollToEnd.subscribe($event => {
                            this.onScrollToEnd({ event: $event });
                        });
                    }
                });
        }
    }
}

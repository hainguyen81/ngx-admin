import {AbstractFormlyComponent} from './abstract.formly.component';
import {DataSource} from '@app/types/index';
import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, QueryList, Renderer2, ViewChildren, ViewContainerRef,} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {ActivatedRoute, Router} from '@angular/router';
import {FormlyForm} from '@ngx-formly/core';
import ComponentUtils from 'app/utils/common/component.utils';

/**
 * Form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form',
    templateUrl: './formly.component.html',
    styleUrls: ['./formly.component.scss'],
})
export class NgxFormlyComponent extends AbstractFormlyComponent<any, DataSource>
    implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren(FormlyForm)
    private readonly queryFormlyForm: QueryList<FormlyForm>;
    private __formlyForm: FormlyForm;

    private model: any = undefined;

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    /**
     * Get the {FormlyForm} instance
     * @return the {FormlyForm} instance
     */
    protected get formlyForm(): FormlyForm {
        return this.__formlyForm;
    }

    /**
     * Get the form data model
     * @return the form data model
     */
    getModel(): any {
        return this.model;
    }

    /**
     * Set the form data model
     * @param model to apply
     */
    public setModel(model: any) {
        this.getFormGroup().reset(this.model);
        this.model = model || {};
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AbstractComponent} class
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

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.__formlyForm) {
            this.__formlyForm = ComponentUtils.queryComponent(this.queryFormlyForm);
        }
    }
}

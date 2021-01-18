import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnDestroy, Renderer2, ViewContainerRef} from '@angular/core';
import {BaseFormlyComponent} from '../../formly/base.formly.component';
import {ConfirmPopup} from 'ngx-material-popup';
import BaseModel, {IModel} from '../../../../@core/data/base';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from '@app/types/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import FunctionUtils from '../../../../utils/common/function.utils';
import ObjectUtils from '../../../../utils/common/object.utils';
import PromiseUtils from '../../../../utils/common/promise.utils';

/**
 * Form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form-app',
    templateUrl: '../../formly/formly.component.html',
    styleUrls: ['../../formly/formly.component.scss', './app.formly.component.scss'],
})
export class AppFormlyComponent<T extends IModel, D extends DataSource>
    extends BaseFormlyComponent<T, D> implements AfterViewInit, OnDestroy {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    protected noneOption: IModel = new BaseModel(null);

    private __modelChangedSubscription: Subscription;

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppFormlyComponent} class
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
    constructor(@Inject(DataSource) dataSource: D,
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
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__modelChangedSubscription) && ObjectUtils.isNotNou(this.formlyForm),
            () => this.__modelChangedSubscription = this.formlyForm.modelChange.subscribe(() => this.onModelChanged()),
            this);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        PromiseUtils.unsubscribe(this.__modelChangedSubscription);
    }

    /**
     * Raise when the model of form had been changed
     */
    protected onModelChanged() {
        // this.getLogger().debug('onModelChanged', this.getModel());
    }
}

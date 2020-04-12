import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject, Optional, Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {BaseFormlyComponent} from '../../formly/base.formly.component';
import {ConfirmPopup} from 'ngx-material-popup';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {IModel} from '../../../../@core/data/base';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';

/**
 * Form component base on {FormlyModule}
 */
@Component({
    selector: 'ngx-formly-form-app',
    templateUrl: '../../formly/formly.component.html',
    styleUrls: ['../../formly/formly.component.scss', './app.formly.component.scss'],
})
export abstract class AppFormlyComponent<T extends IModel, D extends DataSource>
    extends BaseFormlyComponent<T, D> implements AfterViewInit {

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
     */
    protected constructor(@Inject(DataSource) dataSource: D,
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
                          @Optional() formConfig?: FormlyConfig,
                          @Optional() formFieldsConfig?: FormlyFieldConfig[] | []) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            formConfig, formFieldsConfig);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.getFormlyForm().modelChange.subscribe(() => this.onModelChanged());
    }

    /**
     * Raise when the model of form had been changed
     */
    protected onModelChanged() {
        this.getLogger().debug('onModelChanged', this.getModel());
    }
}

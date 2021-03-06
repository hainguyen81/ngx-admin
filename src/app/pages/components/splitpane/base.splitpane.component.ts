import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2, Type,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {NgxSplitPaneComponent} from './splitpane.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {IComponentService} from '../../../services/interface.service';
import {AbstractComponentService, BaseComponentService} from '../../../services/component.service';
import ComponentUtils from '../../../utils/component.utils';
import {throwError} from 'rxjs';
import {Lightbox} from 'ngx-lightbox';

/**
 * Base horizontal split-pane component base on {AngularSplitModule}
 */
@Component({
    selector: 'ngx-split-pane',
    templateUrl: './splitpane.component.html',
    styleUrls: ['./splitpane.component.scss'],
})
export abstract class BaseSplitPaneComponent<T extends DataSource> extends NgxSplitPaneComponent {

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
     */
    protected constructor(@Inject(DataSource) dataSource: T,
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
                          @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
    }

    // -------------------------------------------------
    // FUNCTIONS
    // -------------------------------------------------

    /**
     * Create the header toolbar component dynamically
     * @param componentType component type
     * @return created component
     */
    protected setToolbarComponent(componentType: Type<any>): any {
        return super.createComponentAt(this.getHeaderViewContainerComponent(), componentType);
    }

    /**
     * Create the area component dynamically
     * @param areaIndex the area index
     * @param componentType component type
     * @return created component
     */
    protected setAreaComponent(areaIndex: number, componentType: Type<any>): any {
        (!areaIndex || this.getNumberOfAreas() <= areaIndex || areaIndex < 0)
        && throwError('Could not create area component at the invalid index area (' + areaIndex + ')');
        let viewContainerRef: ViewContainerRef;
        viewContainerRef = this.getSplitAreaHolderViewContainerComponents()[areaIndex];
        return super.createComponentAt(viewContainerRef, componentType);
    }
}

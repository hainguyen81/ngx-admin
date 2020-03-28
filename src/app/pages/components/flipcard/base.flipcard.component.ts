import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    Type,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {NgxFlipCardComponent} from './flipcard.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {IComponentService} from '../../../services/interface.service';
import {AbstractComponentService, BaseComponentService} from '../../../services/component.service';
import ComponentUtils from '../../../utils/component.utils';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';

/**
 * Base flip-card base on {NbFlipCardComponent}
 */
@Component({
    selector: 'ngx-flip-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './flipcard.component.html',
    styleUrls: ['./flipcard.component.scss'],
})
export abstract class BaseFlipcardComponent<T extends DataSource> extends NgxFlipCardComponent {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {BaseFlipcardComponent} class
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
                          @Inject(ConfirmPopup) confirmPopup?: ConfirmPopup) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup);
    }

    /**
     * Create the front component dynamically
     * @param componentType front component type
     * @return created component
     */
    protected setFrontComponent(componentType: Type<any>): any {
        let frontComponent: any;
        if (super.getComponentPlaceHolders() && super.getComponentPlaceHolders().length > 0) {
            frontComponent = super.getComponentPlaceHolders()[0].placeComponent(componentType);

        } else {
            let viewContainerRef: ViewContainerRef;
            viewContainerRef = (super.getCardFrontComponentViewContainerRef()
                || super.getFrontComponentViewContainerRef());
            let compServ: IComponentService<any>;
            compServ = new BaseComponentService(
                this.getFactoryResolver(), viewContainerRef, this.getLogger(), componentType);
            frontComponent = ComponentUtils.createComponent(
                (compServ as AbstractComponentService<any>),
                viewContainerRef, true);
        }
        return frontComponent;
    }

    /**
     * Create the back component dynamically
     * @param componentType back component type
     * @return created component
     */
    protected setBackComponent(componentType: Type<any>): any {
        let backComponent: any;
        if (super.getComponentPlaceHolders() && super.getComponentPlaceHolders().length > 1) {
            backComponent = super.getComponentPlaceHolders()[1].placeComponent(componentType);

        } else {
            let viewContainerRef: ViewContainerRef;
            viewContainerRef = (super.getCardBackComponentViewContainerRef()
                || super.getBackComponentViewContainerRef());
            let compServ: IComponentService<any>;
            compServ = new BaseComponentService(
                this.getFactoryResolver(), viewContainerRef, this.getLogger(), componentType);
            backComponent = ComponentUtils.createComponent(
                (compServ as AbstractComponentService<any>),
                viewContainerRef, true);
        }
        return backComponent;
    }
}

import {IContextMenu} from '../../abstract.component';
import {COMMON} from '../../../../config/common.config';
import {
    ChangeDetectorRef, Component,
    ComponentFactoryResolver,
    ElementRef,
    Inject,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ToastrService} from 'ngx-toastr';
import {BaseSmartTableComponent} from '../../smart-table/base.smart-table.component';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ContextMenuService} from 'ngx-contextmenu';
import {Lightbox} from 'ngx-lightbox';
import {ConfirmPopup} from 'ngx-material-popup';
import {TranslateService} from '@ngx-translate/core';
import {IModel} from '../../../../@core/data/base';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';

export const AppCommonContextMenu: IContextMenu[] = [].concat(COMMON.baseMenu);

@Component({
    selector: 'ngx-smart-table-app',
    templateUrl: '../../smart-table/smart-table.component.html',
    styleUrls: ['../../smart-table/smart-table.component.scss'],
})
export abstract class AppSmartTableComponent<T extends IModel, D extends DataSource>
    extends BaseSmartTableComponent<D> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {AppSmartTableComponent} class
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
                          @Inject(Lightbox) lightbox?: Lightbox) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox);
        super.setContextMenu(AppCommonContextMenu);
    }

    doSearch(keyword: any): void {
        this.getDataSource().setFilter([], false);
        this.getDataSource().refresh();
    }
}

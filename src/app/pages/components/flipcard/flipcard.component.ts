import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Inject,
    QueryList,
    Renderer2,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import {DataSource} from 'ng2-smart-table/lib/data-source/data-source';
import {AbstractFlipcardComponent} from './abstract.flipcard.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import ComponentUtils from '../../../utils/component.utils';
import {ToastrService} from 'ngx-toastr';

/**
 * Flip-card base on {NbFlipCardComponent}
 */
@Component({
    selector: 'ngx-flip-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './flipcard.component.html',
    styleUrls: ['./flipcard.component.scss'],
})
export class NgxFlipCardComponent extends AbstractFlipcardComponent<DataSource> implements AfterViewInit {

    // -------------------------------------------------
    // DECLARATION
    // -------------------------------------------------

    @ViewChildren('frontComponent', {read: ViewContainerRef})
    private readonly queryFontComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private frontComponentHolderViewContainerRef: ViewContainerRef;

    @ViewChildren('backComponent', {read: ViewContainerRef})
    private readonly queryBackComponentHolderViewContainerRef: QueryList<ViewContainerRef>;
    private backComponentHolderViewContainerRef: ViewContainerRef;

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
     */
    protected constructor(@Inject(DataSource) dataSource: DataSource,
                          @Inject(ContextMenuService) contextMenuService: ContextMenuService,
                          @Inject(ToastrService) toasterService: ToastrService,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(Renderer2) renderer: Renderer2,
                          @Inject(TranslateService) translateService: TranslateService,
                          @Inject(ComponentFactoryResolver) factoryResolver: ComponentFactoryResolver,
                          @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                          @Inject(ChangeDetectorRef) changeDetectorRef: ChangeDetectorRef) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef,
            false, false);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        if (!this.frontComponentHolderViewContainerRef) {
            this.frontComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryFontComponentHolderViewContainerRef);
        }
        if (!this.backComponentHolderViewContainerRef) {
            this.backComponentHolderViewContainerRef =
                ComponentUtils.queryComponent(this.queryBackComponentHolderViewContainerRef);
        }
    }
}

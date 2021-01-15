import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2, ViewContainerRef} from '@angular/core';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../../../abstract.component';
import {Row} from '@app/types/index';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import Customer, {ICustomer} from '../../../../../@core/data/system/customer';
import {CustomerDatasource} from '../../../../../services/implementation/system/customer/customer.datasource';
import {CustomerSmartTableComponent} from './customer.table.component';
import {CustomerToolbarComponent} from './customer.toolbar.component';
import {CustomerFormlyComponent} from './customer.formly.component';
import {ACTION_BACK, ACTION_DELETE, ACTION_IMPORT, ACTION_RESET, ACTION_SAVE} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, Router} from '@angular/router';
import {AppTableFlipFormComponent} from '../../components/app.table.flip.form.component';

@Component({
    moduleId: Constants.COMMON.MODULE_CODES.SYSTEM_CUSTOMER,
    selector: 'ngx-flip-app-system-customer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flip/flip.component.html',
    styleUrls: [
        '../../../flip/flip.component.scss',
        '../../components/app.flip.component.scss',
    ],
})
export class CustomerComponent
    extends AppTableFlipFormComponent<
        ICustomer, CustomerDatasource,
        CustomerToolbarComponent,
        CustomerSmartTableComponent,
        CustomerFormlyComponent> {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get visibleSpecialActionsOnFront(): String[] {
        return [ACTION_IMPORT];
    }

    protected get visibleActionsOnBack(): String[] {
        return [ACTION_BACK, ACTION_SAVE, ACTION_RESET, ACTION_DELETE];
    }

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {CustomerComponent} class
     * @param dataSource {CustomerDatasource}
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
    constructor(@Inject(CustomerDatasource) dataSource: CustomerDatasource,
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
            CustomerToolbarComponent,
            CustomerSmartTableComponent,
            CustomerFormlyComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected onNewData($event: IEvent): void {
        const newInst: ICustomer = new Customer(null, null, null, null);
        super.backComponent.setModel(newInst);
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        row && row.getData() && super.backComponent.setModel(row.getData() as ICustomer);
    }
}

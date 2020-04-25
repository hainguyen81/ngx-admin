import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ComponentFactoryResolver, ElementRef,
    Inject,
    Renderer2, ViewContainerRef,
} from '@angular/core';
import {AppTableFlipFormComponent} from '../../components/app.table.flip.form.component';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {IEvent} from '../../../abstract.component';
import {Row} from 'ng2-smart-table/lib/data-set/row';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import MODULE_CODES = Constants.COMMON.MODULE_CODES;
import User, {IUser} from '../../../../../@core/data/system/user';
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';
import {UserSmartTableComponent} from './user.table.component';
import {UserToolbarComponent} from './user.toolbar.component';
import {UserFormlyComponent} from './user.formly.component';

@Component({
    moduleId: MODULE_CODES.SYSTEM_USER,
    selector: 'ngx-flip-card-app-system-user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: '../../../flipcard/flipcard.component.html',
    styleUrls: [
        '../../../flipcard/flipcard.component.scss',
        '../../components/app.flipcard.component.scss',
    ],
})
export class UserComponent
    extends AppTableFlipFormComponent<
        IUser, UserDataSource,
        UserToolbarComponent,
        UserSmartTableComponent,
        UserFormlyComponent> {

    // -------------------------------------------------
    // CONSTRUCTION
    // -------------------------------------------------

    /**
     * Create a new instance of {UserComponent} class
     * @param dataSource {UserDataSource}
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
    constructor(@Inject(UserDataSource) dataSource: UserDataSource,
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
            modalDialogService, confirmPopup, lightbox,
            UserToolbarComponent,
            UserSmartTableComponent,
            UserFormlyComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    protected onNewData($event: IEvent): void {
        const newInst: IUser = new User(
            null, null, null, null,
            null, null, null, null,
            null, null, null, null);
        super.getBackComponent().setModel(newInst);
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        row && row.getData() && super.getBackComponent().setModel(row.getData() as IUser);
    }
}

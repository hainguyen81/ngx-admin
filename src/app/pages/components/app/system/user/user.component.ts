import {
    AfterViewInit,
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
import {Row} from '@app/types/index';
import {Constants} from '../../../../../@core/data/constants/common.constants';
import User, {IUser} from '../../../../../@core/data/system/user';
import {UserDataSource} from '../../../../../services/implementation/system/user/user.datasource';
import {UserSmartTableComponent} from './user.table.component';
import {UserToolbarComponent} from './user.toolbar.component';
import {UserFormlyComponent} from './user.formly.component';
import {
    ACTION_BACK,
    ACTION_DELETE,
    ACTION_IMPORT,
    ACTION_RESET,
    ACTION_SAVE,
} from '../../../../../config/toolbar.actions.conf';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import ArrayUtils from '../../../../../utils/common/array.utils';

@Component({
    moduleId: Constants.COMMON.MODULE_CODES.SYSTEM_USER,
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
        UserFormlyComponent>
    implements AfterViewInit {

    // -------------------------------------------------
    // GETTERS/SETTERS
    // -------------------------------------------------

    protected get visibleSpecialActionsOnFront(): String[] {
        return [ACTION_IMPORT];
    }

    protected get visibleActionsOnBack(): String[] {
        return [ACTION_DELETE, ACTION_RESET, ACTION_SAVE, ACTION_BACK];
    }

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
     * @param router {Router}
     * @param activatedRoute {ActivatedRoute}
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
                @Inject(Lightbox) lightbox?: Lightbox,
                @Inject(Router) router?: Router,
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute) {
        super(dataSource, contextMenuService, toasterService, logger,
            renderer, translateService, factoryResolver,
            viewContainerRef, changeDetectorRef, elementRef,
            modalDialogService, confirmPopup, lightbox,
            router, activatedRoute,
            UserToolbarComponent,
            UserSmartTableComponent,
            UserFormlyComponent);
    }

    // -------------------------------------------------
    // EVENTS
    // -------------------------------------------------

    ngAfterViewInit(): void {
        super.ngAfterViewInit();

        // shortcut for profile
        const parametersMap: Observable<ParamMap> = super.parametersMap;
        parametersMap && parametersMap.subscribe(value => {
            if (value && value.has('profile') && value.get('profile')) {
                const profileId: string = value.get('profile');
                const userDataSource: UserDataSource = <UserDataSource>this.getDataSource();
                userDataSource
                    .setFilter([{ field: 'id', search: profileId}], false)
                    .getAll().then(user => {
                        if (!user) {
                            this.showGlobalError();
                        } else {
                            this.onEditUser(ArrayUtils.isArray(user) ? Array.from(user)[0] : user);
                        }
                    }, reason => throwError(reason))
                    .catch(reason => throwError(reason));
            }
        });
    }

    protected onNewData($event: IEvent): void {
        const newInst: IUser = new User(
            null, null, null, null,
            null, null, null, null,
            null, null, null, null);
        super.backComponent.setModel(newInst);
    }

    protected onEditData($event: IEvent): void {
        const row: Row = ($event.data && $event.data['row'] instanceof Row ? $event.data['row'] : undefined);
        row && row.getData() && this.onEditUser(row.getData() as IUser);
    }
    protected onEditUser(user: IUser) {
        !user && this.showGlobalError();
        user && super.backComponent.setModel(user);
        if (user) {
            this.flipped = true;
        }
    }

    protected doBack(): void {
        const _this: UserComponent = this;
        const _superDoBack: () => void = super.doBack;
        const parametersMap: Observable<ParamMap> = super.parametersMap;
        parametersMap && parametersMap.subscribe(value => {
            if (value && value.has('profile') && value.get('profile')) {
                const userDataSource: UserDataSource = <UserDataSource>_this.getDataSource();
                userDataSource.reset(true);
                _this.getRouter().navigate(['/dashboard/system/user'], { replaceUrl: true });

            } else {
                _superDoBack.call(_this);
            }
        });
        !parametersMap && _superDoBack.call(_this);
    }
}

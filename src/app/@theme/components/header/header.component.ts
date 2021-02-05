import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
/* Authentication */
import {NbAuthOAuth2Token, NbAuthService, NbAuthToken} from '@nebular/auth';
import {AppConfig} from '../../../config/app.config';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {NbxOAuth2AuthDbService} from '../../../auth/auth.oauth2.service';
import {AbstractComponent} from '../../../pages/components/abstract.component';
import {DataSource} from '@app/types/index';
import {ContextMenuService} from 'ngx-contextmenu';
import {ToastrService} from 'ngx-toastr';
import {ModalDialogService} from 'ngx-modal-dialog';
import {ConfirmPopup, ConfirmPopupConfig} from 'ngx-material-popup';
import {Lightbox} from 'ngx-lightbox';
import {NgxLocalStorageEncryptionService} from '../../../services/storage.services/local.storage.services';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDbService} from '../../../services/implementation/system/user/user.service';
import * as moment from 'moment';
import ObjectUtils from '../../../utils/common/object.utils';
import ArrayUtils from '../../../utils/common/array.utils';
import FunctionUtils from '../../../utils/common/function.utils';
import PromiseUtils from '../../../utils/common/promise.utils';
import AssertUtils from '@app/utils/common/assert.utils';

@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent extends AbstractComponent implements OnInit, OnDestroy {

    private destroy$: Subject<void> = new Subject<void>();
    userPictureOnly: boolean = false;

    /* Authentication */
    private token: NbAuthToken;
    private _user: any = {};

    private __tokenChangeSubscription: Subscription;
    private __mediaQueryChangeSubscription: Subscription;
    private __themeChangeSubscription: Subscription;
    private __menuClickSubscription: Subscription;

    private _languages: string[] = AppConfig.i18n.languages;
    currentTheme = 'default';
    private _currentLang = 'en';

    // private userMenu: NbMenuItem[] = [{title: 'Profile'}, {title: 'Log out'}];
    private userMenuTag: string = 'userProfileMenu';
    private userMenu: NbMenuItem[] = [
        {
            icon: {icon: 'user', pack: 'fa'},
            title: 'common.profile.title',
            skipLocationChange: true,
            data: 'profileMenu',
        },
        {
            icon: {icon: 'sign-out-alt', pack: 'fas'},
            title: 'common.logout.title',
            skipLocationChange: true,
            data: 'logoutMenu',
        },
    ];

    get user(): any {
        return this._user;
    }

    get currentLang(): string {
        return this._currentLang;
    }

    get languages(): string[] {
        return this._languages || [];
    }

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
                @Inject(ActivatedRoute) activatedRoute?: ActivatedRoute,
                @Inject(NbSidebarService) private sidebarService?: NbSidebarService,
                @Inject(NbMenuService) private menuService?: NbMenuService,
                @Inject(NbThemeService) private themeService?: NbThemeService,
                @Inject(NbMediaBreakpointsService) private breakpointService?: NbMediaBreakpointsService,
                @Inject(NbAuthService) private authService?: NbAuthService,
                @Inject(NbxOAuth2AuthDbService) private authDbService?: NbxOAuth2AuthDbService<NbAuthToken>,
                @Inject(NgxLocalStorageEncryptionService) private localStorage?: NgxLocalStorageEncryptionService,
                @Inject(UserDbService) private userDbService?: UserDbService) {
        super(dataSource, contextMenuService, toasterService, logger, renderer,
            translateService, factoryResolver, viewContainerRef, changeDetectorRef,
            elementRef, modalDialogService, confirmPopup, lightbox,
            router, activatedRoute);
        AssertUtils.isValueNotNou(sidebarService, 'Could not inject NbSidebarService instance');
        AssertUtils.isValueNotNou(menuService, 'Could not inject NbMenuService instance');
        AssertUtils.isValueNotNou(themeService, 'Could not inject NbThemeService instance');
        AssertUtils.isValueNotNou(breakpointService, 'Could not inject NbMediaBreakpointsService instance');
        AssertUtils.isValueNotNou(authService, 'Could not inject NbAuthService instance');
        AssertUtils.isValueNotNou(authDbService, 'Could not inject NbxOAuth2AuthDbService instance');
        AssertUtils.isValueNotNou(localStorage, 'Could not inject NgxLocalStorageEncryptionService instance');
        AssertUtils.isValueNotNou(userDbService, 'Could not inject UserDbService instance');
        AssertUtils.isValueNotNou(router, 'Could not inject Router instance');
    }

    ngOnInit(): void {
        super.ngOnInit();

        /* Authentication */
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__tokenChangeSubscription),
            () => this.__tokenChangeSubscription = this.authService.onTokenChange().subscribe((token: NbAuthOAuth2Token) => {
                // here we receive a payload from the token and assigns it to our `user` variable
                this.token = (token && token.isValid() ? token : undefined);
                this._user = (this.token ? this.token.getPayload() : {});
                this._currentLang = this._user['lang'] || this._languages[0];
                this._user['lang'] = this._currentLang;
                this.token && this.initialize();
            }), this);
    }

    ngOnDestroy() {
        PromiseUtils.unsubscribe(this.__tokenChangeSubscription);
        PromiseUtils.unsubscribe(this.__mediaQueryChangeSubscription);
        PromiseUtils.unsubscribe(this.__themeChangeSubscription);
        PromiseUtils.unsubscribe(this.__menuClickSubscription);
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initialize() {
        this.currentTheme = this.themeService.currentTheme;
        this._languages = this.getTranslateService().getLangs();
        if (!this._languages || !this._languages.length) {
            this._languages = [];
            (this.getTranslateService().defaultLang || '').length
            && this._languages.push(this.getTranslateService().defaultLang);
        }
        let currentLang: string;
        currentLang = ((this.getTranslateService().currentLang || '').length
            ? this.getTranslateService().currentLang
            : (this.getTranslateService().defaultLang || '').length
                ? this.getTranslateService().defaultLang
                : this._languages && this._languages.length ? this._languages[0] : '');
        (this._languages.indexOf(currentLang) < 0)
        && this._languages.push(currentLang);
        this._currentLang = currentLang;
        this.getLogger().debug('CURRENT LANGUAGE', this._currentLang);

        /*this.userService.getUsers()
          .pipe(takeUntil(this.destroy$))
          .subscribe((users: any) => this.user = users.nick);*/

        const {xl} = (this.breakpointService ? this.breakpointService.getBreakpointsMap() : undefined);
        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__mediaQueryChangeSubscription),
            () => this.__mediaQueryChangeSubscription = this.themeService.onMediaQueryChange().pipe(
                map(([, currentBreakpoint]) => (xl && currentBreakpoint.width < xl)),
                takeUntil(this.destroy$),
            ).subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl),
            this);

        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__themeChangeSubscription),
            () => this.__themeChangeSubscription = this.themeService.onThemeChange().pipe(
                map(({name}) => name),
                takeUntil(this.destroy$),
            ).subscribe(themeName => this.currentTheme = themeName),
            this);

        FunctionUtils.invokeTrue(
            ObjectUtils.isNou(this.__menuClickSubscription),
            () => this.__menuClickSubscription = this.menuService.onItemClick().pipe(
                filter(({ tag }) => tag === this.userMenuTag),
                map(({item}) => item)
            ).subscribe(value => this.onMenuClick(value)),
            this);

        this.userDbService.findEntities('id', IDBKeyRange.only(this._user['id']))
            .then(value => {
                this._user['image'] = ObjectUtils.requireTypedValue<string[]>(value, 'image', []);
            }, reason => {
                this.getLogger().error(reason);
            })
            .catch(reason => {
                this.getLogger().error(reason);
            });
    }

    changeTheme(themeName: string) {
        this.themeService.changeTheme(themeName);
    }

    changeLanguage(language: string) {
        // apply moment locale for date/time
        moment.locale(language);

        this.getTranslateService().use(language);
        this._user['lang'] = language;
        this.authDbService.update(this.token);
    }

    getUserMenu(): NbMenuItem[] {
        this.userMenu.forEach(item => item.title = this.getTranslateService().instant(item.title));
        return this.userMenu;
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');

        return false;
    }

    navigateHome() {
        this.menuService.navigateHome();
        return false;
    }

    private onMenuClick(item: NbMenuItem): void {
        if (ObjectUtils.isNou(item) || !item.data) {
            return;
        }
        switch (item.data) {
            case 'profileMenu': {
                this.doProfile();
                break;
            }
            case 'logoutMenu': {
                this.doLogout();
                break;
            }
        }
    }
    private doProfile(): void {
        const profileLink: string = ['/dashboard/system/user',
            (this._user['id'] || '').length ? '/'.concat(this._user['id']) : ''].join('');
        this.getRouter().navigate([profileLink], { skipLocationChange: false });
    }
    private doLogout(): void {
        const popupConfig: ConfirmPopupConfig = {
            title: this.translate('app'),
            content: this.translate('common.toast.confirm.logout.message'),
            color: 'primary',
            cancelButton: this.translate('common.toast.confirm.logout.cancel'),
            okButton: this.translate('common.toast.confirm.logout.ok'),
        };
        super.showActionConfirmation(popupConfig, this.performLogout);
    }
    private performLogout(): void {
        this.authDbService.clear()
            .then(value => {
                this.localStorage.clear();
                this.getRouter().navigate(['/auth'], { replaceUrl: true });
            });
    }

    private getProfileImage(): string {
        if (!this._user || !this._user['image']) return '';
        if (ArrayUtils.isArray(this._user['image']) && Array.from(this._user['image']).length) {
            return Array.from(this._user['image'])[0] as string;

        } else if (this._user['image']) {
            return this._user['image'];
        }
    }
}

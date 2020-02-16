import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
/* Authentication */
import {NbAuthOAuth2Token, NbAuthService, NbAuthToken} from '@nebular/auth';
import {AppConfig} from '../../../config/app.config';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';
import {NbxOAuth2AuthDbService} from '../../../auth/auth.oauth2.service';

@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

    private destroy$: Subject<void> = new Subject<void>();
    userPictureOnly: boolean = false;

    /* Authentication */
    token: NbAuthToken;
    user: any;

    languages = AppConfig.i18n.languages;

    themes = [
        {
            value: 'default',
            name: 'Light',
        },
        {
            value: 'dark',
            name: 'Dark',
        },
        {
            value: 'cosmic',
            name: 'Cosmic',
        },
        {
            value: 'corporate',
            name: 'Corporate',
        },
    ];

    currentTheme = 'default';
    currentLang = 'en';

    userMenu = [{title: 'Profile'}, {title: 'Log out'}];

    constructor(private sidebarService: NbSidebarService,
                private menuService: NbMenuService,
                private themeService: NbThemeService,
                private breakpointService: NbMediaBreakpointsService,
                private authService: NbAuthService,
                private authDbService: NbxOAuth2AuthDbService<NbAuthToken>,
                private translateService: TranslateService,
                private logger: NGXLogger) {
        /* Authentication */
        this.authService.onTokenChange()
            .subscribe((token: NbAuthOAuth2Token) => {

                if (token.isValid()) {
                    // here we receive a payload from the token and assigns it to our `user` variable
                    this.token = token;
                    this.user = token.getPayload();
                    this.currentLang = this.user['lang'] || this.languages[0];
                    this.user['lang'] = this.currentLang;
                }
            });
    }

    ngOnInit() {
        this.currentTheme = this.themeService.currentTheme;
        this.languages = this.translateService.getLangs();
        if (!this.languages || !this.languages.length) {
            this.languages = [];
            (this.translateService.defaultLang || '').length
            && this.languages.push(this.translateService.defaultLang);
        }
        let currentLang: string;
        currentLang = ((this.translateService.currentLang || '').length
            ? this.translateService.currentLang
            : (this.translateService.defaultLang || '').length
                ? this.translateService.defaultLang
                : this.languages && this.languages.length ? this.languages[0] : '');
        (this.languages.indexOf(currentLang) < 0)
        && this.languages.push(currentLang);
        this.currentLang = currentLang;
        this.logger.debug('CURRENT LANGUAGE', this.currentLang);

        /*this.userService.getUsers()
          .pipe(takeUntil(this.destroy$))
          .subscribe((users: any) => this.user = users.nick);*/

        const {xl} = this.breakpointService.getBreakpointsMap();
        this.themeService.onMediaQueryChange()
            .pipe(
                map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
                takeUntil(this.destroy$),
            )
            .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

        this.themeService.onThemeChange()
            .pipe(
                map(({name}) => name),
                takeUntil(this.destroy$),
            )
            .subscribe(themeName => this.currentTheme = themeName);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    changeTheme(themeName: string) {
        this.themeService.changeTheme(themeName);
    }

    changeLanguage(language: string) {
        this.translateService.use(language);
        this.user['lang'] = language;
        this.authDbService.update(this.token);
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');

        return false;
    }

    navigateHome() {
        this.menuService.navigateHome();
        return false;
    }
}

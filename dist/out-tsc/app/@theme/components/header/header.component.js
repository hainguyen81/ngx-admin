import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
// import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
/* Authentication */
import { NbAuthService } from '@nebular/auth';
let HeaderComponent = class HeaderComponent {
    constructor(sidebarService, menuService, themeService, 
    // private userService: UserData,
    layoutService, breakpointService, authService) {
        this.sidebarService = sidebarService;
        this.menuService = menuService;
        this.themeService = themeService;
        this.layoutService = layoutService;
        this.breakpointService = breakpointService;
        this.authService = authService;
        this.destroy$ = new Subject();
        this.userPictureOnly = false;
        this.themes = [
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
        this.currentTheme = 'default';
        this.userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
        /* Authentication */
        this.authService.onTokenChange()
            .subscribe((token) => {
            if (token.isValid()) {
                // here we receive a payload from the token and assigns it to our `user` variable
                this.user = token.getPayload();
            }
        });
    }
    ngOnInit() {
        this.currentTheme = this.themeService.currentTheme;
        /*this.userService.getUsers()
          .pipe(takeUntil(this.destroy$))
          .subscribe((users: any) => this.user = users.nick);*/
        const { xl } = this.breakpointService.getBreakpointsMap();
        this.themeService.onMediaQueryChange()
            .pipe(map(([, currentBreakpoint]) => currentBreakpoint.width < xl), takeUntil(this.destroy$))
            .subscribe((isLessThanXl) => this.userPictureOnly = isLessThanXl);
        this.themeService.onThemeChange()
            .pipe(map(({ name }) => name), takeUntil(this.destroy$))
            .subscribe(themeName => this.currentTheme = themeName);
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    changeTheme(themeName) {
        this.themeService.changeTheme(themeName);
    }
    toggleSidebar() {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();
        return false;
    }
    navigateHome() {
        this.menuService.navigateHome();
        return false;
    }
};
HeaderComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-header',
        styleUrls: ['./header.component.scss'],
        templateUrl: './header.component.html',
    }),
    tslib_1.__metadata("design:paramtypes", [NbSidebarService,
        NbMenuService,
        NbThemeService,
        LayoutService,
        NbMediaBreakpointsService,
        NbAuthService])
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map
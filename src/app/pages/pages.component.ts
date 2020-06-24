import {AfterViewInit, Component, Inject} from '@angular/core';
import {MenuService} from '../services/implementation/menu.service';
import {NbMenuItem} from '@nebular/theme';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';

@Component({
    selector: 'ngx-pages',
    styleUrls: ['pages.component.scss'],
    template: `
        <ngx-one-column-layout>
            <nb-menu [items]='menu'></nb-menu>
            <router-outlet></router-outlet>
        </ngx-one-column-layout>
    `,
})
export class PagesComponent implements AfterViewInit {

    private _menu: NbMenuItem[];

    get menu(): NbMenuItem[] {
        return this._menu;
    }

    set menu(_menu: NbMenuItem[]) {
        this._menu = _menu || [];
    }

    protected getMenuService(): MenuService {
        return this.menuService;
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected getTranslateService(): TranslateService {
        return this.translateService;
    }

    constructor(@Inject(MenuService) private menuService: MenuService,
                @Inject(NGXLogger) private logger: NGXLogger,
                @Inject(TranslateService) private translateService: TranslateService) {
        menuService || throwError('Could not inject MenuService');
        logger || throwError('Could not inject NGXLogger');
        translateService || throwError('Could not inject TranslateService');
        this._menu = [];
    }

    ngAfterViewInit(): void {
        this.getMenuService().buildMenu().then(
            (menuItems: NbMenuItem[]) => {
                this.getLogger().debug('Menu', menuItems);
                this.translateMenus(menuItems);
                this.menu = menuItems;
            },
            (errors) => this.getLogger().error(errors));
    }

    private translateMenu(menuItem: NbMenuItem): void {
        if (!menuItem || !menuItem.title) {
            return;
        }
        menuItem.title = this.getTranslateService().instant(menuItem.title);
        if (menuItem.children && menuItem.children.length) {
            for (const menu of menuItem.children) {
                this.translateMenu(menu);
            }
        }
    }
    private translateMenus(menuItems: NbMenuItem[]): void {
        if (!menuItems || !menuItems.length) {
            return;
        }
        for (const menu of menuItems) {
            this.translateMenu(menu);
        }
    }
}

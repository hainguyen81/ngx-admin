import {Component, Inject, OnInit} from '@angular/core';
import {MenuService} from '../services/implementation/menu.service';
import {NbMenuItem} from '@nebular/theme';
import {NGXLogger} from 'ngx-logger';

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
export class PagesComponent implements OnInit {

    private menu: NbMenuItem[];

    protected getMenu(): NbMenuItem[] {
        return this.menu;
    }

    protected getMenuService(): MenuService {
        return this.menuService;
    }

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    constructor(@Inject(MenuService) private menuService: MenuService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        this.menu = [];
    }

    ngOnInit(): void {
        this.getMenuService().buildMenu().then(
            (menuItems: NbMenuItem[]) => {
                this.getLogger().debug('Menu', menuItems);
                this.menu = menuItems;
            },
            (errors) => this.getLogger().error(errors));
    }
}

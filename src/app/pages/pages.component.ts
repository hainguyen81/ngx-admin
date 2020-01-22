import {Component, Inject} from '@angular/core';
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
export class PagesComponent {

    menu: NbMenuItem[];

    constructor(@Inject(MenuService) private menuService: MenuService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        this.menu = [];
        menuService.buildMenu().then(
            (menuItems: NbMenuItem[]) => this.menu = menuItems,
            (errors) => logger.error(errors));
    }
}

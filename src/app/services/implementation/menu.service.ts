import {Inject, Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {NbMenuItem} from '@nebular/theme';
import MenuUtils from '../../utils/system/menu.utils';
import {ModuleService} from './module.service';
import {ConnectionService} from 'ng-connection-service';

@Injectable({ providedIn: 'any' })
export class MenuService extends ModuleService {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService) {
        super(dbService, logger, connectionService);
    }

    public buildMenu(): Promise<NbMenuItem[]> {
        return new Promise((resolve, reject) => {
            super.getAll().then((modules) => {
                let menuItems: NbMenuItem[];
                if (modules && modules.length) {
                    menuItems = MenuUtils.buildMenu(modules, NbMenuItem);
                }
                this.getLogger().debug('Built menu', menuItems);
                resolve(menuItems);
            }, (errors) => {
                this.getLogger().error(errors);
                reject(errors);
            });
        });
    }
}

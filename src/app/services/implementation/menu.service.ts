import {Inject, Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {NbMenuItem} from '@nebular/theme';
import MenuUtils from '../../utils/menu.utils';
import {ModuleService} from './module.service';
import {ConnectionService} from 'ng-connection-service';
import {TranslateService} from '@ngx-translate/core';
import {throwError} from 'rxjs';

@Injectable()
export class MenuService extends ModuleService {

    protected getTranslateService(): TranslateService {
        return this.translateService;
    }

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(ConnectionService) connectionService: ConnectionService,
                @Inject(TranslateService) private translateService: TranslateService) {
        super(dbService, logger, connectionService);
        translateService || throwError('Could not inject TranslateService');
    }

    public buildMenu(): Promise<NbMenuItem[]> {
        return new Promise((resolve, reject) => {
            super.getAll().then((modules) => {
                let menuItems: NbMenuItem[];
                if (modules && modules.length) {
                    menuItems = MenuUtils.buildMenu(modules, NbMenuItem, null, this.getTranslateService());
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

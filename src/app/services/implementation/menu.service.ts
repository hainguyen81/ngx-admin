import {Inject, Injectable, Type} from '@angular/core';
import {NbxOAuth2AuthDbService} from '../../auth/auth.oauth2.service';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {NbMenuItem} from '@nebular/theme';
import {catchError, map} from 'rxjs/operators';
import {NbAuthToken} from '@nebular/auth';
import {Observable} from 'rxjs';
import {isArray, isObject} from 'util';
import ObjectUtils from '../../utils/object.utils';
import {NbxAuthOAuth2Token} from '../../auth/auth.oauth2.token';
import {Role} from '../../@core/data/role';
import {AbstractDbService} from '../database.service';
import {Module} from '../../@core/data/module';
import {DB_STORE} from '../../config/db.config';

export function roleToMenuItem(role: Role): NbMenuItem {
  if (!role || !role.module) {
    return undefined;
  }
  let mnu: NbMenuItem;
  mnu = new NbMenuItem();
  mnu.title = role.module.name;
  mnu.data = role.module;
  mnu.expanded = false;
  mnu.selected = false;
  return mnu;
}

export function moduleToMenuItem(modules: Module[], parent?: NbMenuItem): NbMenuItem[] {
  let menuItems: NbMenuItem[];
  menuItems = [];
  if (modules && modules.length) {
    modules.forEach((module: Module) => {
      let mnu: NbMenuItem;
      mnu = new NbMenuItem();
      mnu.title = module.name;
      mnu.data = module;
      mnu.expanded = false;
      mnu.selected = false;
      mnu.children = [];
      if (parent) {
        mnu.parent = parent;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(mnu);
      }
      menuItems.push(mnu);
      if (module.children && module.children.length) {
        moduleToMenuItem(module.children, mnu);
      }
    });
  }
  return menuItems;
}

@Injectable()
export class MenuService extends AbstractDbService<Module> {

    constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService,
                @Inject(NGXLogger) logger: NGXLogger,
                @Inject(NbxOAuth2AuthDbService) private authDbService: NbxOAuth2AuthDbService<NbxAuthOAuth2Token>) {
        super(dbService, logger, DB_STORE.module);
    }

    public buildMenu(): Observable<NbMenuItem[]> {
        return super.getAll().pipe(map((modules: Module[]) => {
          if (!modules || !modules.length) {
            return this.authDbService.getAll().pipe(map((tokens: any) => {
                return tokens.length > 0 ? tokens.shift() : null;
              }),
              map((token: {[key: string]: string | number} | string) => this.doBuildMenuItem(token)),
              catchError((errors) => {
                this.getLogger().error(errors);
                return [];
              }));
          } else {
              return moduleToMenuItem(modules);
          }
        }), catchError((errors) => {
          this.getLogger().error(errors);
          return [];
        }));
    }

    private doBuildMenuItem(token: {[key: string]: string | number} | string): NbMenuItem[] {
        let menuItems: NbMenuItem[];
        menuItems = [];
        let isValidToken: boolean;
        let nbAUthToken: NbxAuthOAuth2Token;
        nbAUthToken = new NbxAuthOAuth2Token(token, NbAuthToken.name);
        isValidToken = (nbAUthToken && typeof nbAUthToken.getPayload === 'function');
        isValidToken = isValidToken && (isObject(nbAUthToken.getPayload()) && nbAUthToken.isValid());
        if (isValidToken) {
            let payload: Object;
            payload = ObjectUtils.cast(nbAUthToken.getPayload(), Object);
            isValidToken = isValidToken && (payload && payload.hasOwnProperty('rolesGroup'));
            isValidToken = isValidToken && (payload['rolesGroup'] && payload['rolesGroup'].hasOwnProperty('roles'));
            isValidToken = isValidToken && (payload['rolesGroup']['roles'] && isArray(payload['rolesGroup']['roles']));
            if (isValidToken) {
                // clear all cache database
                this.clear();

                // build menu items from role
                let roles: Role[];
                let modules: Module[];
                roles = payload['rolesGroup']['roles'];
                modules = [];
                roles.forEach((role: Role) => {
                   if (role.module) {
                     this.insert(role.module as Module);
                     modules.push(role.module as Module);
                   }
                });
                menuItems = moduleToMenuItem(modules);
            }
        }
        return menuItems;
    }

  delete(entity: Module): Observable<number> {
    return this.promiseToObservable(this.getDbService().delete({ 'code': entity.code }));
  }

  findEntities(criteria?: any): Observable<Module[]> {
    if (!criteria) return super.getAll();
    return this.promiseToObservable(this.getDbService().getByIndex('code', criteria));
  }

  findById(id?: any): Observable<Module> {
    return this.promiseToObservable(this.getDbService().getByIndex('id', id));
  }

  insert(entity: Module): Observable<number> {
    return this.promiseToObservable(this.getDbService().clear().then(() => this.getDbService().add(entity)));
  }

  update(entity: Module): Observable<number> {
    return this.promiseToObservable(this.getDbService().update({
      'name': entity.name,
    }));
  }
}

import {NbAuthOAuth2Token} from '@nebular/auth';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import JsonUtils from '../app.utils';
import {Inject} from '@angular/core';
import {DB_STORE} from '../db.config';

export class NbxAuthOAuth2Token extends NbAuthOAuth2Token {

  @Inject(NgxIndexedDBService) private readonly dbService: NgxIndexedDBService;
  protected getDbService(): NgxIndexedDBService {
    return this.dbService;
  }

  @Inject(NGXLogger) private readonly logger: NGXLogger;
  protected getLogger(): NGXLogger {
    return this.logger;
  }

  constructor(data: {[key: string]: string | number} | string,
              ownerStrategyName: string, createdAt?: Date) {
    super(JsonUtils.parseFisrtResponseJson(data), ownerStrategyName, createdAt);
    this.getLogger().info(super.token, 'TOKEN');
    this.getDbService().currentStore = DB_STORE.auth;
    this.storeDb();
  }

  private storeDb() {
    if (!super.isValid()) {
      return;
    }
    let oauth2Token: NbxAuthOAuth2Token;
    oauth2Token = this;
    oauth2Token.getDbService().clear().then(
      () => {
        oauth2Token.getDbService().add(oauth2Token.token).then(
          () => {
            oauth2Token.getLogger().info(oauth2Token.token);
          }, error => {
            oauth2Token.getLogger().error(error);
          },
        );
      }, error => {
        oauth2Token.getLogger().error(error);
      },
    );
  }
}

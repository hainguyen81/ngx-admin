import {Inject, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {IUser} from '../../../@core/data/user';
import {AbstractHttpService} from '../../http.service';
import {HttpClient} from '@angular/common/http';
import {ServiceResponse} from '../../response.service';
import JsonUtils from '../../../utils/json.utils';
import {isArray} from 'util';

@Injectable()
export class UserHttpService extends AbstractHttpService<IUser> {

    constructor(@Inject(HttpClient) http: HttpClient, @Inject(NGXLogger) logger: NGXLogger) {
        super(http, logger);
    }

    parseResponse(serviceResponse?: ServiceResponse): IUser | IUser[] {
        if (!serviceResponse || !serviceResponse.getResponse()
            || !serviceResponse.getResponse().body || !serviceResponse.getResponse().ok) {
            return undefined;
        }
        const jsonResponse = JsonUtils.parseResponseJson(serviceResponse.getResponse().body);
        let users: IUser[];
        if (!isArray(jsonResponse)) {
            users.push(jsonResponse);
        } else {
            users = jsonResponse as IUser[];
        }
        return users;
    }
}

// @Injectable()
// export class UserService extends AbstractService<IUser> {
//
//   constructor(@Inject(NgxIndexedDBService) dbService: NgxIndexedDBService, @Inject(NGXLogger) logger: NGXLogger) {
//     super(dbService, logger, DB_STORE.module);
//   }
//
//   delete(entity: Module): Promise<number> {
//     return new Promise((resolve, reject) => {
//       this.getDbService().currentStore = this.getDbStore();
//       this.getDbService().delete({'code': entity.code})
//         .then(() => resolve(1), (errors) => { this.getLogger().error(errors); reject(errors); });
//     });
//   }
//
//   update(entity: Module): Promise<number> {
//     return new Promise((resolve, reject) => {
//       this.getDbService().currentStore = this.getDbStore();
//       this.getDbService().update({ 'name': entity.name })
//         .then(() => resolve(1), (errors) => { this.getLogger().error(errors); reject(errors); });
//     });
//   }
// }

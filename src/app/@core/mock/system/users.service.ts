import {Inject, Injectable} from '@angular/core';
import {UserDbService} from '../../../services/implementation/system/user/user.service';
import {throwError} from 'rxjs';
import {usersGenerate} from './mock.user';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../../config/log.config';
import {IUser} from '../../data/system/user';
import {IMockService} from '../mock.service';
import {COMMON} from '../../../config/common.config';

@Injectable()
export class MockUserService implements IMockService {

    constructor(@Inject(UserDbService) private dbService: UserDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        dbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): Promise<any> {
        if (!COMMON.mock) {
            return Promise.resolve();
        }

        // just generate mock data if empty
        return this.dbService.count().then((recNumber: number) => {
            if (recNumber <= 0) {
                // generate mock data
                let mockUsers: IUser[];
                mockUsers = usersGenerate();
                this.logger.debug('Generate users', mockUsers);
                this.dbService.insertEntities(mockUsers)
                    .then((affected: number) => this.logger.debug('Initialized mock users data', affected),
                        (errors) => this.logger.error('Could not initialize mock user data', errors));
            } else {
                this.logger.debug('Initialized mock users data', recNumber);
            }
        });
    }
}

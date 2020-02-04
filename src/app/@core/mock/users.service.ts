import {Inject, Injectable} from '@angular/core';
import {UserDbService} from '../../services/implementation/user/user.service';
import {throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {MockUser, usersGenerate} from './mock.user';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../config/log.config';
import {IUser} from '../data/user';

@Injectable()
export class MockUserService {

    constructor(@Inject(UserDbService) private userDbService: UserDbService,
                @Inject(NGXLogger) private logger: NGXLogger) {
        userDbService || throwError('Could not inject user database service');
        logger || throwError('Could not inject logger service');
        logger.updateConfig(LogConfig);
    }

    public initialize(): void {
        if (environment.production) {
            return;
        }
        // just generate mock data if empty
        this.userDbService.count().then((recNumber: number) => {
            if (recNumber <= 0) {
                // generate mock users
                let mockUsers: IUser[];
                mockUsers = usersGenerate();
                this.logger.debug('Generate users', mockUsers);
                this.userDbService.insertEntities(mockUsers)
                    .then((affected: number) => this.logger.debug('Initialized mock users data', affected),
                        (errors) => this.logger.error('Could not initialize mock user data', errors));
            } else {
                this.logger.debug('Initialized mock users data', recNumber);
            }
        });
    }
}

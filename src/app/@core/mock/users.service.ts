import {Inject, Injectable} from '@angular/core';
import {UserDbService} from '../../services/implementation/user/user.service';
import {throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {MockUser} from './mock.user';
import {NGXLogger} from 'ngx-logger';
import {LogConfig} from '../../config/log.config';
import EncryptionUtils from '../../utils/encryption.utils';

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
        // encrypt MD5
        MockUser.forEach(u => {
            u.password = EncryptionUtils.md5Encode(':', u.password);
        });
        this.userDbService.clear().then(() => {
            this.userDbService.insertEntities(MockUser)
                .then(() => this.logger.debug('Initialized mock user data!'),
                    (errors) => this.logger.error('Could not initialize mock user data', errors));
        });
    }
}

import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseHttpService} from '../services/common/http.service';
import {NGXLogger} from 'ngx-logger';
import {SwPush} from '@angular/service-worker';
import {BaseDbService} from '../services/common/database.service';
import {IModel} from '../@core/data/base';

export const SW_VAPID_PUBLIC_KEY = new InjectionToken<string>('Service Worker VAPID_PUBLIC_KEY to subscribe');

/**
 * Abstract service for pushing notification
 * @param <T> entity type
 */
@Injectable()
export abstract class AbstractPushService<T extends IModel> extends BaseHttpService<T> {

    protected getSwPush(): SwPush {
        return this.swPush;
    }

    protected getSwVapidPublicKey(): string {
        return this.swVapidPublicKey;
    }

    protected constructor(@Inject(HttpClient) http: HttpClient,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(SwPush) private swPush: SwPush,
                          @Inject(SW_VAPID_PUBLIC_KEY) private swVapidPublicKey: string = 'VAPID_PUBLIC_KEY',
                          @Inject(BaseDbService) dbService: BaseDbService<T>) {
        super(http, logger, dbService);
    }

    subscribe() {
        this.getSwPush().requestSubscription({
            serverPublicKey: this.getSwVapidPublicKey(),
        }).then((subscription: PushSubscription) => this.pushSubscription(subscription))
            .catch(err => this.getLogger().error('Could not subscribe to notifications', err));
    }

    abstract pushSubscription(subscription: PushSubscription);
}

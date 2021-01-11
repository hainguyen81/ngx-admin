import {BaseHttpService} from '../services/common/http.service';
import {ApplicationRef, Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {SwUpdate, UpdateAvailableEvent} from '@angular/service-worker';
import {first} from 'rxjs/operators';
import {concat, interval, Subscription, throwError} from 'rxjs';
import {BaseDbService} from '../services/common/database.service';
import {IModel} from '../@core/data/base';

/**
 * Abstract service for listening application updater
 * @param <T> entity type
 */
@Injectable()
export abstract class AbstractUpdateService<T extends IModel> extends BaseHttpService<T> {

    protected getSwUpdate(): SwUpdate {
        return this.swUpdate;
    }

    protected getAppRef(): ApplicationRef {
        return this.appRef;
    }

    protected constructor(@Inject(HttpClient) http: HttpClient,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(ApplicationRef) private appRef: ApplicationRef,
                          @Inject(SwUpdate) private swUpdate: SwUpdate,
                          @Inject(BaseDbService) dbService: BaseDbService<T>) {
        super(http, logger, dbService);
        // appRef || throwError('Could not inject application reference');
        swUpdate || throwError('Could not inject socket updater subscription');
        if (!dbService) {
            this.getLogger().warn('Could not found database service for offline mode!');
        }

        // Allow the app to stabilize first, before starting polling for updates with `interval()`.
        const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
        const everySixHours$ = interval(this.intervalPeriod());
        const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
        everySixHoursOnceAppIsStable$.subscribe(() => this.getSwUpdate().checkForUpdate());
    }

    subscribe() {
        this.getSwUpdate().available.subscribe((event: UpdateAvailableEvent) => this.observeUpdate(event));
    }

    abstract intervalPeriod(): number;

    abstract observeUpdate(observer?: UpdateAvailableEvent): Subscription;
}

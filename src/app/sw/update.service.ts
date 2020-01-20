import {AbstractHttpService} from '../services/http.service';
import {ApplicationRef, Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {SwUpdate, UpdateAvailableEvent} from '@angular/service-worker';
import {first} from 'rxjs/operators';
import {concat, interval, Subscription} from 'rxjs';

@Injectable()
export abstract class UpdateService<T> extends AbstractHttpService<T> {

    protected getSwUpdate(): SwUpdate {
        return this.swUpdate;
    }

    protected getAppRef(): ApplicationRef {
        return this.appRef;
    }

    protected constructor(@Inject(HttpClient) http: HttpClient,
                          @Inject(NGXLogger) logger: NGXLogger,
                          @Inject(ApplicationRef) private appRef: ApplicationRef,
                          @Inject(SwUpdate) private swUpdate: SwUpdate) {
        super(http, logger);

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

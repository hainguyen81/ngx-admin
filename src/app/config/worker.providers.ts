import {ModuleWithProviders, StaticProvider} from '@angular/core';
import {WorkerService} from '../sw/core/background.task.service';
import {ServiceWorkerModule, SwRegistrationOptions} from '@angular/service-worker';
import {environment} from '../../environments/environment';

export const BackgroundTaskProviders: StaticProvider[] = [
    {provide: WorkerService, useClass: WorkerService, deps: []},
];

export const WorkerProviders: StaticProvider[] = []
    .concat(BackgroundTaskProviders);

export const ServiceWorkerScripts: string[] = [
    './assets/workers/warehouse/warehouse.inventory/warehouse.inventory.service.worker.js',
];

export const ServiceWorkerRegistrationOptions: SwRegistrationOptions = {
    enabled: environment.mock,
    scope: environment.baseHref,
    registrationStrategy: 'registerImmediately',
};

/**
 * Register service workers with angular application
 */
export function registerServiceWorkers(): ModuleWithProviders<{}>[] {
    const serviceWorkers: ModuleWithProviders<{}>[] = [];
    ServiceWorkerScripts.forEach(serviceWorker => {
        serviceWorkers.push(ServiceWorkerModule.register(serviceWorker, ServiceWorkerRegistrationOptions));
    });
    return serviceWorkers;
}

export const WarehouseServiceWorkers: ModuleWithProviders<{}>[] = [].concat(registerServiceWorkers());

export const ServiceWorkerProviders: ModuleWithProviders<{}>[] = []
    .concat(WarehouseServiceWorkers);

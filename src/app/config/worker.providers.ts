import {ModuleWithProviders, StaticProvider} from '@angular/core';
import {WorkerService} from '../sw/core/background.task.service';
import {ServiceWorkerModule, SwRegistrationOptions} from '@angular/service-worker';
import {environment} from '../../environments/environment';

export const BackgroundTaskProviders: StaticProvider[] = [
    {provide: WorkerService, useClass: WorkerService, deps: []},
];

export const WorkerProviders: StaticProvider[] = []
    .concat(BackgroundTaskProviders);

export const ServiceWorkerScripts: { [key: string]: { script: string, controller: ServiceWorker } } = {
    'WAREHOUSE_INVENTORY': {
        script: './assets/workers/warehouse/warehouse.inventory/warehouse.inventory.service.worker.js',
        controller: null,
    },
};

export const ServiceWorkerRegistrationOptions: SwRegistrationOptions = {
    enabled: environment.mock,
    registrationStrategy: 'registerImmediately',
};

/**
 * Register service workers with angular application
 */
export function registerServiceWorkers(): ModuleWithProviders<{}>[] {
    const serviceWorkers: ModuleWithProviders<{}>[] = [];
    Object.keys(ServiceWorkerScripts).forEach(serviceWorkerKey => {
        const serviceWorker: { script: string, controller: ServiceWorker } = ServiceWorkerScripts[serviceWorkerKey];
        serviceWorkers.push(ServiceWorkerModule.register(serviceWorker.script, ServiceWorkerRegistrationOptions));
    });
    return serviceWorkers;
}

export const WarehouseServiceWorkers: ModuleWithProviders<{}>[] = [].concat(registerServiceWorkers());

export const ServiceWorkerProviders: ModuleWithProviders<{}>[] = []
    .concat(WarehouseServiceWorkers);

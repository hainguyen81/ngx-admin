import {ServiceWorkerScripts} from '../../config/worker.providers';
import {isNullOrUndefined} from 'util';

export function registerBrowserServiceWorkers() {
    if (navigator && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registration => {
            console.warn(['Browser service registration', registration]);

            // check for registered services
            let serviceWorkerScripts: string[];
            if (!isNullOrUndefined(registration) && Array.from(registration).length) {
                const unRegistServices: string[] = ServiceWorkerScripts.filter(serviceWorker => {
                    return !Array.from(Array.from(registration).filter(registedService => {
                        return (!isNullOrUndefined(registedService.active)
                            && (registedService.active.scriptURL || '').length
                            && registedService.active.scriptURL.indexOf(serviceWorker) >= 0);
                    })).length;
                });
                serviceWorkerScripts = [].concat(unRegistServices);

            } else {
                serviceWorkerScripts = [].concat(ServiceWorkerScripts);
            }

            // register service worker if necessary
            serviceWorkerScripts.forEach(serviceWorker => {
                navigator.serviceWorker.register(serviceWorker).then(newRegistration => {
                    console.warn([`Register ${serviceWorker} successfully`, newRegistration]);
                }, reason => {
                    console.error(`Could not register ${serviceWorker}: ${reason}`);
                }).catch(reason => {
                    console.error(`Could not register ${serviceWorker}: ${reason}`);
                });
            });
        });
    }
}

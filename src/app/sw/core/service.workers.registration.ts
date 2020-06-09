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
                    if (serviceWorker.startsWith('./')) {
                        serviceWorker = serviceWorker.right(serviceWorker.length - 2);
                    }
                    return !Array.from(registration).filter(registeredService => {
                        return (!isNullOrUndefined(registeredService.active)
                            && (registeredService.active.scriptURL || '').length
                            && registeredService.active.scriptURL.indexOf(serviceWorker) >= 0);
                    }).length;
                });
                serviceWorkerScripts = [].concat(unRegistServices);

            } else {
                serviceWorkerScripts = [].concat(ServiceWorkerScripts);
            }

            // register service worker if necessary
            console.warn(['Need to register service workers', serviceWorkerScripts]);
            serviceWorkerScripts.forEach(serviceWorker => {
                navigator.serviceWorker.register(serviceWorker).then(newRegistration => {
                    console.warn([`Register ${serviceWorker} successfully`, newRegistration]);
                    return navigator.serviceWorker.ready.then(readyRegistration => {
                        readyRegistration.active.postMessage(
                            `Send test message for checking service worker ${serviceWorker}`);
                        navigator.serviceWorker.onmessage = e => {
                            console.warn([`Main application onmessage ${serviceWorker}`, e]);
                        };
                    });
                }, reason => {
                    console.error(`Could not register ${serviceWorker}: ${reason}`);
                }).catch(reason => {
                    console.error(`Could not register ${serviceWorker}: ${reason}`);
                });
            });
        });
    }
}

import {ServiceWorkerScripts} from '../../config/worker.providers';
import {isNullOrUndefined} from 'util';

export function registerBrowserServiceWorkers() {
    if (navigator && 'serviceWorker' in navigator) {
        console.warn(['Start browser service worker registration', navigator.serviceWorker]);
        navigator.serviceWorker.getRegistrations().then(registration => {
            console.warn(['Browser service registration', registration]);

            // check for registered services
            let serviceWorkerScripts: { [key: string]: { script: string, controller: ServiceWorker } }[];
            if (!isNullOrUndefined(registration) && Array.from(registration).length) {
                serviceWorkerScripts = [];
                Object.keys(ServiceWorkerScripts).forEach(serviceWorkerKey => {
                    const serviceWorker: { script: string, controller: ServiceWorker } =
                        ServiceWorkerScripts[serviceWorkerKey];
                    let scriptURL: string = serviceWorker.script;
                    if (scriptURL.startsWith('./')) {
                        scriptURL = scriptURL.right(scriptURL.length - 2);
                    }
                    const checkRegistered: boolean = !Array.from(registration).filter(registeredService => {
                        const registered: boolean = (!isNullOrUndefined(registeredService.active)
                            && (registeredService.active.scriptURL || '').length
                            && registeredService.active.scriptURL.indexOf(scriptURL) >= 0);
                        if (registered) {
                            serviceWorker.controller = registeredService.active;
                            registeredService.update();
                        }
                        return registered;
                    }).length;
                    if (!checkRegistered) {
                        serviceWorkerScripts.push({ [serviceWorkerKey]: serviceWorker });
                    }
                });

            } else {
                serviceWorkerScripts = [].concat(ServiceWorkerScripts);
            }

            // register service worker if necessary
            console.warn(['Need to register service workers', serviceWorkerScripts]);
            Object.keys(serviceWorkerScripts).forEach(serviceWorkerKey => {
                const serviceWorker: { script: string, controller: ServiceWorker } =
                    serviceWorkerScripts[serviceWorkerKey];
                navigator.serviceWorker.register(serviceWorker.script).then(newRegistration => {
                    console.warn([`Register ${serviceWorker} successfully`, newRegistration]);
                    return navigator.serviceWorker.ready.then(readyRegistration => {
                        serviceWorker.controller = readyRegistration.active;
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

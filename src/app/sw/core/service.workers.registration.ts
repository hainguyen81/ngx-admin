import {ServiceWorkerScripts} from '../../config/worker.providers';
import {isNullOrUndefined} from 'util';
import {environment} from '../../../environments/environment';
import EncryptionUtils from '../../utils/encryption.utils';

export function registerBrowserServiceWorkers() {
    if (navigator && 'serviceWorker' in navigator) {
        // register service worker
        console.warn(['Start browser service worker registration', navigator.serviceWorker]);
        navigator.serviceWorker.getRegistrations().then(registration => {
            console.warn(['Browser service registration', registration]);

            // check for registered services
            let workers: { [key: string]: { script: string, controller: ServiceWorker } } = {};
            if (!isNullOrUndefined(registration) && Array.from(registration).length) {
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
                            serviceWorker.controller.postMessage({ type: 'environment', environment: environment });
                            registeredService.update();
                        }
                        return registered;
                    }).length;
                    if (!checkRegistered) {
                        workers[serviceWorkerKey] = serviceWorker;
                    }
                });

            } else {
                workers = Object.assign({}, ServiceWorkerScripts);
            }

            // register service worker if necessary
            console.warn(['Need to register service workers', workers]);
            Object.keys(workers).forEach(serviceWorkerKey => {
                const serviceWorker: { script: string, controller: ServiceWorker } = workers[serviceWorkerKey];
                if ((serviceWorker.script || '').length) {
                    navigator.serviceWorker.register(serviceWorker.script).then(newRegistration => {
                        console.warn([`Register ${serviceWorkerKey} successfully`, newRegistration]);
                        return navigator.serviceWorker.ready.then(readyRegistration => {
                            serviceWorker.controller = readyRegistration.active;
                            serviceWorker.controller.postMessage({ type: 'environment', environment: environment });
                        });
                    }, reason => {
                        console.error(`Could not register ${serviceWorkerKey}: ${reason}`);
                    }).catch(reason => {
                        console.error(`Could not register ${serviceWorkerKey}: ${reason}`);
                    });

                } else {
                    console.warn(`Invalid worker script to register ${serviceWorkerKey}`);
                }
            });
        });
    }
}

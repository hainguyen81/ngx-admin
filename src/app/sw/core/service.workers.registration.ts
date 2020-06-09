import {ServiceWorkerScripts} from '../../config/worker.providers';

export function registerBrowserServiceWorkers() {
    if (navigator && 'serviceWorker' in navigator) {
        ServiceWorkerScripts.forEach(serviceWorker => {
            navigator.serviceWorker.register(serviceWorker);
        });
    }
}

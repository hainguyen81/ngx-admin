// importScripts('./warehouse.inventory.service.js');

var serviceWorker = 'WAREHOUSE_INVENTORY';
console.warn(`Load service worker ${serviceWorker} completely`);
self.addEventListener('activate', e => {
    console.warn([`Activated service worker ${serviceWorker}`, e]);
});
self.addEventListener('fetch', e => {
    console.warn([`Fetched service worker ${serviceWorker}`, e]);
});
self.addEventListener('sync', e => {
    console.warn([`Synchronized service worker ${serviceWorker}`, e]);
});
self.addEventListener('push', e => {
    console.warn([`Pushed service worker ${serviceWorker}`, e]);
});
self.addEventListener('message', e => {
    console.warn([`Received message in service worker ${serviceWorker}`, e]);
});

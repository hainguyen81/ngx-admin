importScripts('./warehouse.inventory.service.js');

self.addEventListener('message', function (e) {
    console.error(['Service worker received message', e]);
});

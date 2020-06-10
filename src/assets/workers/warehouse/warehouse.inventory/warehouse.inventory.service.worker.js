importScripts('../../libs/base.service.js');

var warehouseInventoryServiceWorker = new ServiceWorker({
    name: 'WAREHOUSE_INVENTORY',
    onInstall: function(e) {},
    onActivate: function(e) {},
    onFetch: function(e) {},
    onSync: function(e) {},
    onPush: function(e) {},
    onMessage: function(e) {},
});
warehouseInventoryServiceWorker.initialize();

importScripts('../../libs/base.service.js');
importScripts('./warehouse.inventory.service.js');

class WarehouseInventoryServiceWorker extends ServiceWorker {
    constructor() {
        super({name: 'SW_WAREHOUSE_INVENTORY'});
        this.databaseService = new WarehouseInventoryServiceWorkerDatabase();
    }

    onMessage = function(e) {
        if (e && e.data && e.data.command === 'RECALC') {
            this.databaseService.recalculate(e.data.inventory, e.data.details);
        }
    }
}
var warehouseInventoryServiceWorker = new WarehouseInventoryServiceWorker();
warehouseInventoryServiceWorker.initialize();

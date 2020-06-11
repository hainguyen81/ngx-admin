importScripts('../../libs/base.service.js');
importScripts('./warehouse.inventory.service.js');

class WarehouseInventoryServiceWorker extends ServiceWorker {
    constructor() {
        super({name: 'SW_WAREHOUSE_INVENTORY'});
    }

    onEnvironment = function(e) {
        this.databaseService = new WarehouseInventoryServiceWorkerDatabase(this.options.environment.databaseName);
        console.warn([`${this.options.name}: Initialize database service worker`, e, this.databaseService]);
    }

    onMessage = function(e) {
        if (!this.databaseService) {
            console.warn([`${this.options.name}: Invalid database service worker to process data`, e]);
            return;
        }

        if (e && e.data && e.data.command === 'RECALC') {
            this.databaseService.recalculate(e.data.inventory, e.data.details);
        }
    }
}

var warehouseInventoryServiceWorker = new WarehouseInventoryServiceWorker();
warehouseInventoryServiceWorker.initialize();

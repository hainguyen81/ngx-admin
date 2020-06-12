importScripts('../../libs/base.service.js');
importScripts('./warehouse.inventory.service.js');

class WarehouseInventoryServiceWorker extends ServiceWorker {
    constructor() {
        super({name: 'SW_WAREHOUSE_INVENTORY'});
    }

    get databaseService() {
        if (!this._databaseService) {
            this._databaseService = new WarehouseInventoryServiceWorkerDatabase(this.options);
        }
        return this._databaseService;
    }

    onEnvironment = function(e) {
        this._databaseService = null;
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

// initialize service worker instance
var warehouseInventoryServiceWorker = new WarehouseInventoryServiceWorker();
warehouseInventoryServiceWorker.initialize();

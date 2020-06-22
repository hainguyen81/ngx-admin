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
        var dataService = this.databaseService;
        if (!dataService) {
            console.error([`${this.options.name}: Invalid database service worker to process data`, e]);
            return;
        }

        if (e && e.data) {
            switch (e.data.command || '') {
                case 'RECALC':
                    var _this = this;
                    dataService.recalculate(e.data.inventory, e.data.details,
                        function () { _this.postMessage({ message: 'OK', status: 200 }); });
                    break;
                case 'RECALC_ALL':
                    dataService.recalculateAll();
                    break;
                default:
                    console.warn([`${this.options.name}: Invalid service worker command`, e]);
                    break;
            }

        } else {
            console.error([`${this.options.name}: Invalid service worker message event`, e]);
        }
    }
}

// initialize service worker instance
var warehouseInventoryServiceWorker = new WarehouseInventoryServiceWorker();
warehouseInventoryServiceWorker.initialize();

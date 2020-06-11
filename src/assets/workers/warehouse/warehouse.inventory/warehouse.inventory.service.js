importScripts('../../libs/db.service.js');

class WarehouseInventoryServiceWorkerDatabase extends ServiceWorkerDatabase {
    constructor() {
        super({name: 'DSW_WAREHOUSE_INVENTORY'});
    }

    /**
     * Recalculate the inventory quantities
     * @param inventory to recalculate
     * @param details to recalculate
     */
    recalculate(inventory, details) {
        
    }

    /**
     * Recalculate the INPUT inventory quantities
     * @param inventory to recalculate
     * @param details to recalculate
     */
    recalculateInput(inventory, details) {

    }
}

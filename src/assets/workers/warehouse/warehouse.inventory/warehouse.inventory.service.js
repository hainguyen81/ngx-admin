importScripts('../../libs/db.service.js');

class WarehouseInventoryServiceWorkerDatabase extends ServiceWorkerDatabase {
    constructor(options) {
        super({name: 'DSW_WAREHOUSE_INVENTORY'});
        Object.keys(options).forEach(key => {
            if (!this.options.hasOwnProperty(key)) {
                this.options[key] = options[key];
            }
        });
    }

    /**
     * Recalculate the inventory quantities
     * @param inventory to recalculate
     * @param details to recalculate
     */
    recalculate(inventory, details) {
        var _this = this;
        _this.openDb(function(db, e) {
            var dbStores = _this.options.dbStores || {};
            var objectStores = [dbStores.warehouse_inventory, dbStores.warehouse_inventory_detail, dbStores.warehouse_management];
            var transaction = _this.openTransaction(db, objectStores, 'readwrite');
            var invStore = transaction.objectStore(dbStores.warehouse_inventory);
            var invDetailStore = transaction.objectStore(dbStores.warehouse_inventory_detail);
            var wmStore = transaction.objectStore(dbStores.warehouse_management);

            // recalculate INPUT
            if (!inventory || inventory.type === 'common.enum.warehouseInventoryType.in') {
                _this.recalculateInput(invStore, invDetailStore, wmStore, inventory, details);
            }

            // recalculate OUTPUT
            if (!inventory || inventory.type === 'common.enum.warehouseInventoryType.out') {
                _this.recalculateOutput(invStore, invDetailStore, wmStore, inventory, details);
            }
        })
    }

    /**
     * Recalculate the INPUT inventory quantities
     * @param invStore `warehouse_inventory` database store
     * @param invDetailStore `warehouse_inventory_detail` database store
     * @param wmStore `warehouse_management` database store
     * @param inventory to recalculate
     * @param details to recalculate
     */
    recalculateInput(invStore, invDetailStore, wmStore, inventory, details) {

    }

    /**
     * Recalculate the OUTPUT inventory quantities
     * @param invStore `warehouse_inventory` database store
     * @param invDetailStore `warehouse_inventory_detail` database store
     * @param wmStore `warehouse_management` database store
     * @param inventory to recalculate
     * @param details to recalculate
     */
    recalculateOutput(invStore, invDetailStore, wmStore, inventory, details) {

    }
}

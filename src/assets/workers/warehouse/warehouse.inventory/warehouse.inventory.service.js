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

            var cursor = null;
            if (inventory) {
                var index = invStore.index('code');
                cursor = index.openCursor(IDBKeyRange.only([inventory.code]));

            } else {
                cursor = invStore.openCursor();
            }
            cursor.onsuccess = function(e) {
                var ecur = e.target.result;
                if (ecur) {


                    ecur.continue();

                } else {
                    console.warn(`${_this.options.name}: Finish WAREHOUSE_INVENTORY calculation`);
                }
            };
        });
    }

    /**
     * Recalculate the INPUT inventory quantities
     * @param wmStore `warehouse_management` database store
     * @param inventory to recalculate
     * @param details to recalculate
     */
    recalculateInput(wmStore, inventory, details) {

    }

    /**
     * Recalculate the OUTPUT inventory quantities
     * @param wmStore `warehouse_management` database store
     * @param inventory to recalculate
     * @param details to recalculate
     */
    recalculateOutput(wmStore, inventory, details) {

    }
}

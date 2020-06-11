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
     * @param oldValue old value to calculate revert if necessary. formula { inventory, details }
     * @param newValue new value to calculate. required, formula { inventory, details }
     */
    recalculate(oldValue, newValue) {
        try {
            var _this = this;
            var _oldInv = (oldValue || {}).inventory;
            var _newInv = (newValue || {}).inventory;
            var _oldDetails = (oldValue || {}).details;
            var _newDetails = (newValue || {}).details;
            if (_newInv && _newDetails) {
                _this.openDb(function (db, e) {
                    var dbStores = _this.options.dbStores || {};
                    var objectStores = [dbStores.warehouse_management];
                    var transaction = _this.openTransaction(db, objectStores, 'readwrite');
                    var wmStore = transaction.objectStore(dbStores.warehouse_management);
                    var inInvType = 'common.enum.warehouseInventoryType.in';
                    _this.process(wmStore, _oldInv, _oldDetails,
                        (((_oldInv || {}).type || '') === inInvType), true,
                        function () {
                            _this.process(wmStore, _newInv, _newDetails,
                                (((_newInv || {}).type || '') === inInvType), false);
                        });
                });

            } else {
                console.warn([`${_this.options.name}: Invalid new data to calculate WAREHOUSE_INVENTORY`, oldValue, newValue]);
            }
        } catch (e) {
            console.error([`${_this.options.name}: Error while calculating WAREHOUSE_INVENTORY`, e]);
        }
    }

    /**
     * Process the INPUT/OUTPUT inventory quantities
     * @param dbStore `warehouse_management` database store
     * @param inventory to recalculate
     * @param details to recalculate
     * @param isIn specify whether is INPUT/OUTPUT
     * @param isOld specify whether should revert old data or process new data
     * @param callbackSuccess callback after processing successfully
     */
    process(dbStore, inventory, details, isIn, isOld, callbackSuccess) {
        if (!dbStore) {
            console.warn(`${_this.options.name}: Invalid database store to process WAREHOUSE_INVENTORY`);
            return;
        }
        if (!inventory || !(details || []).length) {
            console.warn(`${_this.options.name}: Invalid inventory or details data to process WAREHOUSE_INVENTORY`);
            return;
        }

        // process
        var _this = this;
        var cursor = dbStore.openCursor();
        cursor.onerror = function(e) {
            console.error([`${_this.options.name}: Could not process data`, inventory, details, e]);
        };
        cursor.onsuccess = function(e) {
            var csr = e.target.result;
            if (cursor) {
                var data = cursor.value;
                for (var i = 0; i < details.length; i++) {
                    var detail = details[i];
                    var updated = false;
                    if ((data.item_code || '') === (detail.item_code || '')) {
                        var needToProcess = ((data.type || '') === 'ITEM');
                        needToProcess = needToProcess
                            || ((data.type || '') === 'WAREHOUSE' && (data.warehouse_code || '') === (inventory.warehouse_code || ''));
                        // process by warehouse, root item
                        if (needToProcess) {
                            data.quantity += (isIn ? ((isOld ? -1 : 1) * detail.quantity_actually)
                                : ((isOld ? 1 : -1) * detail.quantity_actually));
                            updated = true;

                            // check for processing by batch
                        } else if ((data.type || '') === 'BATCH' && (detail.batches || []).length
                            && (data.warehouse_code || '') === (inventory.warehouse_code || '')) {
                            for (var j = 0; j < detail.batches; j++) {
                                var batch = detail.batches[j];
                                if ((data.object_code || '') === (batch.batch_code || '')) {
                                    data.quantity += (isIn ? ((isOld ? -1 : 1) * batch.quantity)
                                        : ((isOld ? 1 : -1) * batch.quantity));
                                    updated = true;
                                    break;
                                }
                            }

                            // check for processing by storage
                        } else if ((data.type || '') === 'STORAGE' && (detail.storage || []).length
                            && (data.warehouse_code || '') === (inventory.warehouse_code || '')) {
                            for (var j = 0; j < detail.storage; j++) {
                                var storage = detail.storage[j];
                                if ((data.object_code || '') === (storage.warehouse_code || '')) {
                                    data.quantity += (isIn ? ((isOld ? -1 : 1) * storage.quantity)
                                        : ((isOld ? 1 : -1) * storage.quantity));
                                    updated = true;
                                    break;
                                }
                            }
                        }
                    }

                    // update value
                    if (updated) {
                        cursor.update(data).onsuccess = function() {
                            console.debug([`${_this.options.name}: Update data successfully`, data]);
                        };
                    }
                }

                // continue processing next record
                cursor.continue();

            } else {
                console.warn(`${_this.options.name}: Finish WAREHOUSE_INVENTORY calculation`);
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess.apply(_this);
                }
            }
        };
    }
}

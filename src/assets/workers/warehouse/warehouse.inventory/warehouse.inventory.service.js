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
                    if (_oldInv) {
                        _this.process(wmStore, _oldInv, _oldDetails,
                            (((_oldInv || {}).type || '') === inInvType), true,
                            function () {
                                _this.process(wmStore, _newInv, _newDetails,
                                    (((_newInv || {}).type || '') === inInvType), false);
                            });

                    } else {
                        _this.process(wmStore, _newInv, _newDetails,
                            (((_newInv || {}).type || '') === inInvType), false);
                    }
                });

            } else {
                console.warn([`${_this.options.name}: Invalid new data to calculate WAREHOUSE_INVENTORY`, oldValue, newValue]);
            }
        } catch (e) {
            console.error([`${_this.options.name}: Error while calculating WAREHOUSE_INVENTORY`, e]);
        }
    }

    /**
     * Build new `warehouse_management` data
     * @param type `warehouse_management` data type
     * @param inventory to build
     * @param sumQuantities sum of detail quantities
     * @param detail to build
     * @param innerDetail batch/storage data to build batch
     * @return single management data or null if invalid
     */
    buildNewManagement(type, inventory, sumQuantities, detail, innerDetail) {
        var valid = false;
        var data = {
            item_id: detail.item_id,
            item_code: detail.item_code,
            item: detail.item,
        };
        switch (type || '') {
            case 'WAREHOUSE':
                data.type = type;
                data.warehouse_id = inventory.warehouse_id;
                data.warehouse_code = inventory.warehouse_code;
                data.warehouse = inventory.warehouse;
                data.quantity = (isNaN(sumQuantities) || sumQuantities <= 0 ? 0 : sumQuantities);
                valid = true;
                break;
            case 'BATCH':
            case 'STORAGE':
                if (detail && innerDetail) {
                    data.type = type;
                    data.warehouse_id = inventory.warehouse_id;
                    data.warehouse_code = inventory.warehouse_code;
                    data.warehouse = inventory.warehouse;
                    if (type === 'BATCH') {
                        data.object_id = innerDetail.batch_id;
                        data.object_code = innerDetail.batch_code;
                        data.quantity = innerDetail.quantity;

                    } else {
                        data.object_id = innerDetail.warehouse_id;
                        data.object_code = innerDetail.warehouse_code;
                        data.quantity = innerDetail.quantity;
                    }
                    data.quantity = (isNaN(data.quantity) || data.quantity <= 0 ? 0 : data.quantity);
                    valid = true;
                }
                break;
            default:
                if (!(type || '').length) {
                    data.quantity = (isNaN(sumQuantities) || sumQuantities <= 0 ? 0 : sumQuantities);
                    valid = true;
                }
                break;
        }
        return (valid ? data : null);
    }

    /**
     * Build new warehouse management data
     * @param inventory to recalculate
     * @param details to recalculate
     * @return multiple management data array or empty if invalid
     */
    processNew(inventory, details) {
        var data = {};
        var sumQuantities = 0;
        (details || []).forEach(detail => {
            sumQuantities += (isNaN(detail.quantity_actually) || detail.quantity_actually <= 0 ? 0 : detail.quantity_actually);
        });
        for (var i = 0; i < (details || []).length; i++) {
            var detail = details[i];
            // root item
            var key = null;
            var item = this.buildNewManagement(null, inventory, sumQuantities, detail, null);
            if (item) {
                key = [item.type || '', item.warehouse_code || '', item.object_code || ''].join('_');
                data[key] = item;
            }
            // warehouse item
            item = this.buildNewManagement('WAREHOUSE', inventory, sumQuantities, detail, null);
            if (item) {
                key = [item.type || '', item.warehouse_code || '', item.object_code || ''].join('_');
                data[key] = item;
            }
            // batch items
            (detail.batches || []).forEach(batch => {
                item = this.buildNewManagement('BATCH', inventory, -1, detail, batch);
                if (item) {
                    key = [item.type || '', item.warehouse_code || '', item.object_code || ''].join('_');
                    data[key] = item;
                }
            });
            // storage items
            (detail.storage || []).forEach(storage => {
                item = this.buildNewManagement('BATCH', inventory, -1, detail, storage);
                if (item) {
                    key = [item.type || '', item.warehouse_code || '', item.object_code || ''].join('_');
                    data[key] = item;
                }
            });
        }
        return data;
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
        var _this = this;
        if (!dbStore) {
            console.warn(`${_this.options.name}: Invalid database store to process`);
            return;
        }
        if (!inventory || !(details || []).length) {
            console.warn(`${_this.options.name}: Invalid inventory or details data to process`);
            return;
        }

        // build data
        var data = _this.processNew(inventory, details);
        console.warn([`${_this.options.name}: Build processed data`, data]);

        // check for inserting new data
        console.warn(`${_this.options.name}: Start processing data`);
        var reqCount = dbStore.count();
        reqCount.onerror = function(e) {
            console.error([`:::${_this.options.name}: Could not process data`, inventory, details, e]);
        }
        reqCount.onsuccess = function(e) {
            var count = e.result;
            // if insert new if database is empty
            if ((isNaN(count) || count <= 0) && !isOld && Object.keys(data).length) {
                Object.keys(data).forEach(key => {
                    if (!isNaN(data[key].quantity) && data[key].quantity > 0) {
                        var insReq = dbStore.add(data[key]);
                        insReq.onsuccess = function(ie) {
                            console.debug([`:::${_this.options.name}: Insert data successfully`, data[key], ie]);
                            delete data[key];
                        };
                        insReq.onerror = function(ie) {
                            console.error([`:::${_this.options.name}: Could not insert data`, data[key], ie]);
                            delete data[key];
                        };
                    }
                });

                // check for updating existing and inserting new if necessary
            } else if (!isNaN(count) && count > 0 && inventory && (details || []).length) {
                var cursor = dbStore.openCursor();
                cursor.onerror = function(e) {
                    console.error([`:::${_this.options.name}: Could not process data`, inventory, details, e]);
                };
                cursor.onsuccess = function(e) {
                    var csr = e.target.result;
                    if (csr) {
                        var record = csr.value;
                        var recordKey  = [record.type || '', record.warehouse_code || '', record.object_code || ''].join('_');
                        Object.keys(data).forEach(key => {
                            if (key === recordKey) {
                                var item = data[key];
                                record.quantity += (isIn ? ((isOld ? -1 : 1) * item.quantity) : ((isOld ? 1 : -1) * item.quantity));

                                // delete 0 quantity data
                                if (isNaN(record.quantity) || record.quantity <= 0) {
                                    var delReq = csr.delete();
                                    delReq.onsuccess = function(de) {
                                        console.debug([`:::${_this.options.name}: Delete 0 quantity data successfully`, record, de]);
                                        delete data[key];
                                    };
                                    delReq.onerror = function(de) {
                                        console.error([`:::${_this.options.name}: Could not delete 0 quantity data`, record, de]);
                                        delete data[key];
                                    };

                                } else {
                                    var updReq = csr.update(record);
                                    updReq.onsuccess = function(ue) {
                                        console.debug([`:::${_this.options.name}: Update data successfully`, record, ue]);
                                        delete data[key];
                                    };
                                    updReq.onerror = function(ue) {
                                        console.error([`:::${_this.options.name}: Could not update data`, record, ue]);
                                        delete data[key];
                                    };
                                }
                            }
                        });

                        // continue processing next record
                        csr.continue();

                    } else {
                        // check for inserting new if adding more data in updating case
                        if (Object.keys(data).length && !isOld) {
                            console.warn([`:::${_this.options.name}: Insert new data in UPDATING case`, data]);
                            Object.keys(data).forEach(key => {
                                if (!isNaN(data[key].quantity) && data[key].quantity > 0) {
                                    var insReq = dbStore.add(data[key]);
                                    insReq.onsuccess = function(ie) {
                                        console.debug([`::::::${_this.options.name}: Insert data successfully`, data[key], ie]);
                                        delete data[key];
                                    };
                                    insReq.onerror = function(ie) {
                                        console.error([`::::::${_this.options.name}: Could not insert data`, data[key], ie]);
                                        delete data[key];
                                    };
                                }
                            });
                        }
                        console.warn(`:::${_this.options.name}: Finish warehouse processing`);
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess.apply(_this);
                        }
                    }
                };
            }
        }
    }
}

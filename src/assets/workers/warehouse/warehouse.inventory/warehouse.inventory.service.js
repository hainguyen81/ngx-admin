importScripts('../../libs/idbstore/1.7.2/idbstore.min.js');

var inventories = new IDBStore({
    dbVersion: 1,
    storeName: 'warehouse_inventory',
    keyPath: 'id',
    autoIncrement: true,
    onStoreReady: function(){
        console.log('Store ready!');
    }
});

var inventoryDetails = new IDBStore({
    dbVersion: 1,
    storeName: 'warehouse_inventory_detail',
    keyPath: 'id',
    autoIncrement: true,
    onStoreReady: function(){
        console.log('Store ready!');
    }
});

var warehouseManagement = new IDBStore({
    dbVersion: 1,
    storeName: 'warehouse_management',
    keyPath: 'id',
    autoIncrement: true,
    onStoreReady: function(){
        console.log('Store ready!');
    }
});

/**
 * Update the inventory quantity
 * @param data the inventory need to update
 */
function updateInventory(data) {
    var onEnd = function (evt) {
        console.error(['Finish to update', evt]);
    }

    var inv_code = (data || {})['code'] || '';
    if (inv_code.length) {
        var onUpdate = function(dataItem, cursor, transaction) {
            console.error([dataItem, cursor, transaction]);
        };

        inventoryDetails.query(onUpdate, {
            index: '__warehouse_inv_detail_index_by_inventory_code',
            keyRange: IDBKeyRange.only(inv_code),
            order: 'ASC',
            filterDuplicates: false,
            writeAccess: false,
            onEnd: onEnd,
            onError: function (err) {
                console.error(['Could not query warehouse_inventory_detail', err]);
            }
        });
    }
}

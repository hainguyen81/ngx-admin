importScripts('../../libs/idbstore/1.7.2/idbstore.min.js')

var inventories = new IDBStore({
    dbVersion: 1,
    storeName: 'warehouse_inventory',
    keyPath: 'id',
    autoIncrement: true,
    onStoreReady: function(){
        console.log('Store ready!');
    }
});



var workerSelf = self;
var workerCaches = caches;
var workerClients = clients;
var workerCrypto = crypto;
var workerDbFactory = indexedDB;

class ServiceWorkerDatabase {
    constructor(options) {
        this.options = (typeof options === 'object' ? options : {});
        this.options.name = (this.options.name || 'BASE_SERVICE_WORKER_DATABASE');
        this.options.self = workerSelf;
        this.options.dbFactory = workerDbFactory;
        this.options.caches = workerCaches;
        this.options.clients = workerClients;
        this.options.crypto = workerCrypto;
        console.warn([`Create database service worker ${this.options.name}`, this.options]);
    }

    get dbFactory() {
        return this.options.dbFactory;
    }

    get caches() {
        return this.options.caches;
    }

    get clients() {
        return this.options.clients;
    }

    get crypto() {
        return this.options.crypto;
    }

    get databaseName() {
        return (this.options.environment || {}).databaseName || '';
    }

    /**
     * Open the specified database name
     * @param databaseName to open
     * @param onError to callback while error occurred. formula: function(e) {}
     * @param onSuccess to callback for returning {IDBDatabase} instance. formula: function(database, e) {}
     */
    openDb(onSuccess, onError) {
        var databaseName = this.databaseName;
        if (!databaseName.length) {
            (typeof onError === 'function')
            && onError.apply(this, [`${this.options.name}: Could not open the invalid database name`]);
            (typeof onError !== 'function')
            && console.error(`${this.options.name}: Could not open the invalid database name`);
            return;
        }
        if (!this.options.self) {
            (typeof onError === 'function')
            && onError.apply(this, [`${this.options.name}: Could not found the service instance to open database: ${databaseName}`]);
            (typeof onError !== 'function')
            && console.error(`${this.options.name}: Could not found the service instance to open database: ${databaseName}`);
            return;
        }
        if (!this.options.dbFactory) {
            (typeof onError === 'function')
            && onError.apply(this, [`${this.options.name}: Could not found the database factory instance to open database: ${databaseName}`]);
            (typeof onError !== 'function')
            && console.error(`${this.options.name}: Could not found the database factory instance to open database: ${databaseName}`);
            return;
        }

        var _this = this;
        var dbRequest = this.options.dbFactory.open(databaseName);
        // these two event handlers act on the database being opened successfully, or not
        dbRequest.onerror = function(e) {
            (typeof onError === 'function')
            && onError.apply(_this, [e]);
            (typeof onError !== 'function')
            && console.error([`${_this.options.name}: Could not open database: ${databaseName}`, e]);
        };
        dbRequest.onsuccess = function(e) {
            console.debug([`${_this.options.name}: Open database successfully: ${databaseName}`, e]);
            (typeof onSuccess === 'function')
            && onSuccess.apply(_this, [dbRequest.result, e]);
            (typeof onSuccess !== 'function')
            && console.warn([`${_this.options.name} didn't implement onSuccess callback to apply`, e, dbRequest.result]);
        };
    }

    /**
     * Open the database store transaction with the specified permissions of the specified database
     * @param database to open transaction
     * @param dbStore to open storage
     * @param permissions open with permissions: `readonly`, `readwrite`, `versionchange`
     * @return {IDBTransaction}
     */
    openTransaction(database, dbStore, permissions) {
        if (!database || typeof database.transaction !== 'function') {
            console.error(`${this.options.name}: Could not open transaction because of invalid database instance`);
            return undefined;
        }
        if (!(dbStore || '').length) {
            console.error(`${this.options.name}: Could not open transaction because of invalid database store name`);
            return undefined;
        }
        return database.transaction(dbStore, permissions);
    }
}

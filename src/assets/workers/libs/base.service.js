var workerSelf = self;
var workerCaches = caches;
var workerClients = clients;
var workerCrypto = crypto;

class ServiceWorker {
    constructor(options) {
        this.options = (typeof options === 'object' ? options : {});
        this.options.name = (this.options.name || 'BASE_SERVICE_WORKER');
        this.options.self = workerSelf;
        this.options.caches = workerCaches;
        this.options.clients = workerClients;
        this.options.crypto = workerCrypto;
        this._initialized = false;
        console.warn([`Create service worker ${this.options.name}`, this.options]);
    }

    get initialized() {
        return this._initialized;
    }

    get instance() {
        return this.options.self;
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

    postMessage(message) {
        const channel = new BroadcastChannel((message || {}).name || this.options.name);
        channel.postMessage(message);
    }

    initialize() {
        if (this._initialized || !this.options.self) {
            if (!this.options.self) {
                console.error(`${this.options.name}: Could not found the service instance to initialize`);
            }
            return;
        }

        console.warn(`Load service worker ${this.options.name} completely`);
        this.options.self.addEventListener('install', e => {
            if (typeof this.onInstall === 'function') {
                console.warn([`${this.options.name}: Installing service worker`, e]);
                this.onInstall.apply(this, [e]);

            } else if (typeof this.options.onInstall === 'function') {
                console.warn([`${this.options.name}: Installing service worker`, e]);
                this.options.onInstall.apply(this, [e]);

            } else {
                console.warn([`${this.options.name}: Didn't implement onInstall callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('activate', e => {
            if (typeof this.onActivate === 'function') {
                console.warn([`${this.options.name}: Activating service worker`, e]);
                this.onActivate.apply(this, [e]);

            } else if (typeof this.options.onActivate === 'function') {
                console.warn([`${this.options.name}: Activating service worker`, e]);
                this.options.onActivate.apply(this, [e]);

            } else {
                console.warn([`${this.options.name}: Didn't implement onActivate callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('fetch', e => {
            if (typeof this.onFetch === 'function') {
                console.warn([`${this.options.name}: Fetching service worker`, e]);
                this.onFetch.apply(this, [e]);

            } else if (typeof this.options.onFetch === 'function') {
                console.warn([`${this.options.name}: Fetching service worker`, e]);
                this.options.onFetch.apply(this, [e]);

            } else {
                console.warn([`${this.options.name}: Didn't implement onFetch callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('sync', e => {
            if (typeof this.onSync === 'function') {
                console.warn([`${this.options.name}: Synchronizing service worker`, e]);
                this.onSync.apply(this, [e]);

            } else if (typeof this.options.onSync === 'function') {
                console.warn([`${this.options.name}: Synchronizing service worker`, e]);
                this.options.onSync.apply(this, [e]);

            } else {
                console.warn([`${this.options.name}: Didn't implement onSync callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('push', e => {
            if (typeof this.onPush === 'function') {
                console.warn([`${this.options.name}: Pushing service worker`, e]);
                this.onPush.apply(this, [e]);

            } else if (typeof this.options.onPush === 'function') {
                console.warn([`${this.options.name}: Pushing service worker`, e]);
                this.options.onPush.apply(this.options.self, [e]);

            } else {
                console.warn([`${this.options.name}: Didn't implement onPush callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('message', e => {
            if (e && e.data && e.data.type === 'environment') {
                this.options.environment = e.data.environment;
                this.options.dbStores = e.data.dbStores;
                if (typeof this.onEnvironment === 'function') {
                    console.warn([`${this.options.name}: Initialize environment message service worker`, e]);
                    this.onEnvironment.apply(this, [e]);

                } else if (typeof this.options.onEnvironment === 'function') {
                    console.warn([`${this.options.name}: Initialize environment message service worker`, e]);
                    this.options.onEnvironment.apply(this, [e]);

                } else {
                    console.warn([`${this.options.name}: Didn't implement onEnvironment callback to apply`, e]);
                }

            } else {
                if (typeof this.onMessage === 'function') {
                    console.warn([`${this.options.name}: Receiving message service worker`, e]);
                    this.onMessage.apply(this, [e]);

                } else if (typeof this.options.onMessage === 'function') {
                    console.warn([`${this.options.name}: Receiving message service worker`, e]);
                    this.options.onMessage.apply(this, [e]);

                } else {
                    console.warn([`${this.options.name}: Didn't implement onMessage callback to apply`, e]);
                }
            }
        });
        this.options.self.addEventListener('pushsubscriptionchange', e => {
            if (typeof this.onPushSubscriptionChange === 'function') {
                console.warn([`${this.options.name}: PushSubscription changing service worker`, e]);
                this.onPushSubscriptionChange.apply(this, [e]);

            } else if (typeof this.options.onPushSubscriptionChange === 'function') {
                console.warn([`${this.options.name}: PushSubscription changing service worker`, e]);
                this.options.onPushSubscriptionChange.apply(this, [e]);

            } else {
                console.warn([`${this.options.name}: Didn't implement onPushSubscriptionChange callback to apply`, e]);
            }
        });
        this.options.self.onnotificationclick = function(e) {
            if (typeof this.onNotificationClick === 'function') {
                console.warn([`${this.options.name}: Clicking on notification service worker`, e]);
                this.onNotificationClick.apply(this, [e]);

            } else if (typeof this.options.onNotificationClick === 'function') {
                console.warn([`${this.options.name}: Clicking on notification service worker`, e]);
                this.options.onNotificationClick.apply(this, [e]);

            } else {
                console.warn([`${this.options.name}: Didn't implement onNotificationClick callback to apply`, e]);
            }
        };
        this.options.self.onnotificationclose = function(e) {
            if (typeof this.onNotificationClose === 'function') {
                console.warn([`${this.options.name}: Closing notification service worker`, e]);
                this.onNotificationClose.apply(this, [e]);

            } else if (typeof this.options.onNotificationClose === 'function') {
                console.warn([`${this.options.name}: Closing notification service worker`, e]);
                this.options.onNotificationClose.apply(this, [e]);

            } else {
                console.warn([`${this.options.name}: Didn't implement onNotificationClose callback to apply`, e]);
            }
        };
        this._initialized = true;
    }
}

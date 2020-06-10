var workerSelf = self;

class ServiceWorker {
    constructor(options) {
        this.options = (typeof options === 'object' ? options : {});
        this.options.name = (this.options.name || 'BASE_SERVICE_WORKER');
        this.options.self = workerSelf;
        this._initialized = false;
        console.warn([`Create service worker ${this.options.name}`, this.options]);
    }

    initialize() {
        if (this._initialized || !this.options.self) {
            if (!this.options.self) {
                console.error(`Could not found the service instance ${this.options.name} to initialize`);
            }
            return;
        }

        console.warn(`Load service worker ${this.options.name} completely`);
        this.options.self.addEventListener('install', e => {
            if (typeof this.options.onInstall === 'function') {
                console.warn([`Installing service worker ${this.options.name}`, e]);
                this.options.onInstall.apply(this.options.self, [e]);
            } else {
                console.warn([`${this.options.name} didn't implement onInstall callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('activate', e => {
            if (typeof this.options.onActivate === 'function') {
                console.warn([`Activating service worker ${this.options.name}`, e]);
                this.options.onActivate.apply(this.options.self, [e]);
            } else {
                console.warn([`${this.options.name} didn't implement onActivate callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('fetch', e => {
            if (typeof this.options.onFetch === 'function') {
                console.warn([`Fetching service worker ${this.options.name}`, e]);
                this.options.onFetch.apply(this.options.self, [e]);
            } else {
                console.warn([`${this.options.name} didn't implement onFetch callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('sync', e => {
            if (typeof this.options.onSync === 'function') {
                console.warn([`Synchronizing service worker ${this.options.name}`, e]);
                this.options.onSync.apply(this.options.self, [e]);
            } else {
                console.warn([`${this.options.name} didn't implement onSync callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('push', e => {
            if (typeof this.options.onPush === 'function') {
                console.warn([`Pushing service worker ${this.options.name}`, e]);
                this.options.onPush.apply(this.options.self, [e]);
            } else {
                console.warn([`${this.options.name} didn't implement onPush callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('message', e => {
            if (e && e.data && e.data.type === 'environment') {
                this.options.environment = e.data.environment;
                if (typeof this.options.onEnvironment === 'function') {
                    console.warn([`Initialize environment message service worker ${this.options.name}`, e]);
                    this.options.onEnvironment.apply(this.options.self, [e]);

                } else {
                    console.warn([`${this.options.name} didn't implement onEnvironment callback to apply`, e]);
                }

            } else if (typeof this.options.onMessage === 'function') {
                console.warn([`Receiving message service worker ${this.options.name}`, e]);
                this.options.onMessage.apply(this.options.self, [e]);

            } else {
                console.warn([`${this.options.name} didn't implement onMessage callback to apply`, e]);
            }
        });
        this.options.self.addEventListener('pushsubscriptionchange', e => {
            if (typeof this.options.onPushSubscriptionChange === 'function') {
                console.warn([`PushSubscription changing service worker ${this.options.name}`, e]);
                this.options.onPushSubscriptionChange.apply(this.options.self, [e]);
            } else {
                console.warn([`${this.options.name} didn't implement onPushSubscriptionChange callback to apply`, e]);
            }
        });
        this.options.self.onnotificationclick = function(e) {
            if (typeof this.options.onNotificationClick === 'function') {
                console.warn([`Clicking on notification service worker ${this.options.name}`, e]);
                this.options.onNotificationClick.apply(this.options.self, [e]);
            } else {
                console.warn([`${this.options.name} didn't implement onNotificationClick callback to apply`, e]);
            }
        };
        this.options.self.onnotificationclose = function(e) {
            if (typeof this.options.onNotificationClose === 'function') {
                console.warn([`Closing notification service worker ${this.options.name}`, e]);
                this.options.onNotificationClose.apply(this.options.self, [e]);
            } else {
                console.warn([`${this.options.name} didn't implement onNotificationClose callback to apply`, e]);
            }
        };
        this._initialized = true;
    }
}

const PROXY_CONFIG = {
    "/api/*": {
        "target": "https://www.universal-tutorial.com/",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true,
    }
}

module.exports = PROXY_CONFIG;

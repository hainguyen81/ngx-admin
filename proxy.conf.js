const PROXY_CONFIG = {
    "/api/*": {
        "target": "https://www.universal-tutorial.com/",
        "secure": true,
        "logLevel": "debug",
        "changeOrigin": true,
    }
}

module.exports = PROXY_CONFIG;

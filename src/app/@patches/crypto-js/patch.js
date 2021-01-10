const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
const f_crypto_js = 'node_modules/crypto-js/crypto-js.js';
const f_crypto = 'node_modules/crypto-js/crypto.js';

fs.exists(f, exists => {
    if (exists) {
        fs.readFile(f, 'utf8', function (err, data) {
            if (/node: false/g.test(data || '')) {
                var result = (data || '').replace(/node: false/g, 'node: {crypto: true, stream: true}');
                fs.writeFile(f, result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            }
        });
    }
});

fs.exists(f_crypto_js, existsSrc => {
    fs.exists(f_crypto, existsDest => {
        if (existsSrc && !existsDest) {
            fs.copyFile(f_crypto_js, f_crypto, (err) => {
                if (err) return console.log(err);
            });
        }
    });
});

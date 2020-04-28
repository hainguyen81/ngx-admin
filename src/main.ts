/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {enableProdMode, PlatformRef} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const platformRef: PlatformRef = platformBrowserDynamic();
platformRef.bootstrapModule(AppModule).then(
    module => {
        window.console.error(['======= MAIN BOOTSTRAP APPLICATION SUCCESSFUL =======']);
    }, reason => window.console.error(['======= MAIN BOOTSTRAP APPLICATION ERROR =======', reason]))
    .catch(reason => window.console.error(['======= MAIN BOOTSTRAP APPLICATION ERROR =======', reason]));

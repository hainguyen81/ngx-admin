/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {enableProdMode, PlatformRef} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {ComponentLifeCycle, mixins} from './app/runtime/runtime';
import {ModalDialogComponent} from 'ngx-modal-dialog';

if (environment.production) {
  enableProdMode();
}

// TODO should mixins prototypes before bootstrap application module
mixins(ModalDialogComponent, [ComponentLifeCycle]);

const platformRef: PlatformRef = platformBrowserDynamic();
platformRef.bootstrapModule(AppModule).then(
    module => window.console.info(['======= MAIN BOOTSTRAP APPLICATION SUCCESSFUL =======', module]),
        reason => window.console.error(['======= MAIN BOOTSTRAP APPLICATION ERROR =======', reason]))
    .catch(reason => window.console.error(['======= MAIN BOOTSTRAP APPLICATION ERROR =======', reason]));

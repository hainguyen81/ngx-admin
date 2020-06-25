/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {enableProdMode, PlatformRef} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {ModalDialogComponent} from 'ngx-modal-dialog';
import {FormlyFormBuilder} from '@ngx-formly/core';
import {NgxFormlyFormBuilderRuntime} from './app/runtime/formly.form.builder.runtime';
import {ComponentLifeCycleRuntime} from './app/runtime/component.lifecycle.runtime';
import {mixins} from './app/runtime/runtime';

if (environment.production) {
    enableProdMode();
}

// TODO should mixins prototypes before bootstrap application module
// window.console.warn(['Browser locale', navigator.language, navigator.languages]);
mixins(ModalDialogComponent, [ComponentLifeCycleRuntime]);
mixins(FormlyFormBuilder, [NgxFormlyFormBuilderRuntime]);

const platformRef: PlatformRef = platformBrowserDynamic();
platformRef.bootstrapModule(AppModule).then(
    module => window.console.info(['======= MAIN BOOTSTRAP APPLICATION SUCCESSFUL =======', module]),
        reason => window.console.error(['======= MAIN BOOTSTRAP APPLICATION ERROR =======', reason]))
    .catch(reason => window.console.error(['======= MAIN BOOTSTRAP APPLICATION ERROR =======', reason]));

import {SubscribeHandler} from '../event.handler.service';
import {Inject} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {
    BaseElementKeydownHandlerService,
    BaseElementKeypressHandlerService,
    BaseElementKeyupHandlerService,
} from './base.keyboard.handler';

/**
 * `Document` `keypress` event handler service
 */
export class DocumentKeypressHandlerService extends BaseElementKeypressHandlerService<Document> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

/**
 * `Document` `keyup` event handler service
 */
export class DocumentKeyupHandlerService extends BaseElementKeyupHandlerService<Document> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

/**
 * `Document` `keydown` event handler service
 */
export class DocumentKeydownHandlerService extends BaseElementKeydownHandlerService<Document> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

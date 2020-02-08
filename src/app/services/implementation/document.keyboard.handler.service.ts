import {
    AbstractKeydownEventHandlerService,
    AbstractKeypressEventHandlerService,
    AbstractKeyupEventHandlerService,
    SubscribeHandler,
} from '../event.handler.service';
import {Inject} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

/**
 * `Document` `keypress` event handler service
 */
export class DocumentKeypressHandlerService extends AbstractKeypressEventHandlerService<Document> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

/**
 * `Document` `keyup` event handler service
 */
export class DocumentKeyupHandlerService extends AbstractKeyupEventHandlerService<Document> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

/**
 * `Document` `keydown` event handler service
 */
export class DocumentKeydownHandlerService extends AbstractKeydownEventHandlerService<Document> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

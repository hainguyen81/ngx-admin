import {SubscribeHandler} from '../common/event.handler.service';
import {Inject} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BaseElementKeydownHandlerService, BaseElementKeypressHandlerService, BaseElementKeyupHandlerService,} from './base.keyboard.handler';

/**
 * `Document` `keypress` event handler service
 */
export class DocumentKeypressHandlerService extends BaseElementKeypressHandlerService<Node> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

/**
 * `Document` `keyup` event handler service
 */
export class DocumentKeyupHandlerService extends BaseElementKeyupHandlerService<Node> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

/**
 * `Document` `keydown` event handler service
 */
export class DocumentKeydownHandlerService extends BaseElementKeydownHandlerService<Node> {

    constructor(eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(document, eventHandlerDelegate, logger);
    }
}

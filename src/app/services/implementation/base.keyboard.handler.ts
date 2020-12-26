import {
    AbstractKeydownEventHandlerService,
    AbstractKeypressEventHandlerService,
    AbstractKeyupEventHandlerService,
    SubscribeHandler,
} from '../common/event.handler.service';
import {Inject} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {FromEventTarget} from 'rxjs/internal/observable/fromEvent';

/**
 * Element `keypress` event handler service
 */
export class BaseElementKeypressHandlerService<T extends Node> extends AbstractKeypressEventHandlerService<T> {

    constructor(target: FromEventTarget<T>,
                eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(target, eventHandlerDelegate, logger);
    }
}

/**
 * Element `keyup` event handler service
 */
export class BaseElementKeyupHandlerService<T extends Node> extends AbstractKeyupEventHandlerService<T> {

    constructor(target: FromEventTarget<T>,
                eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(target, eventHandlerDelegate, logger);
    }
}

/**
 * Element `keydown` event handler service
 */
export class BaseElementKeydownHandlerService<T extends Node> extends AbstractKeydownEventHandlerService<T> {

    constructor(target: FromEventTarget<T>,
                eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                @Inject(NGXLogger) logger: NGXLogger) {
        super(target, eventHandlerDelegate, logger);
    }
}

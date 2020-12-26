import {EventEmitter, Inject, Output} from '@angular/core';
import {fromEvent, Subscribable, throwError} from 'rxjs';
import {FromEventTarget} from 'rxjs/internal/observable/fromEvent';
import {NGXLogger} from 'ngx-logger';
import KeyboardUtils from '../../utils/common/keyboard.utils';

/**
 * The delegate Subscribe function type for handling event
 * @param <T> event type
 */
export type SubscribeHandler<T> = (value?: T | Subscribable<T>) => void;

/**
 * Abstract service for handling event from the specified element
 * @param <T> element type to handle event
 * @param <K> event type
 */
export abstract class AbstractEventHandlerService<T, K> {

    protected getLogger(): NGXLogger {
        return this.logger;
    }

    protected getTarget(): FromEventTarget<T> {
        return this.target;
    }

    protected getEventName(): string {
        return this.eventName;
    }

    protected getEventHandler(): SubscribeHandler<K> {
        return this.eventHandlerDelegate;
    }

    protected constructor(private target: FromEventTarget<T>, private eventName: string,
                          private eventHandlerDelegate: SubscribeHandler<K>,
                          @Inject(NGXLogger) private logger: NGXLogger) {
        target || throwError('Target object to handle could not be NULL');
        (eventName || '').length || throwError('Event to handle could not be empty');
        logger || throwError('Could not inject logger!');
        fromEvent(target, eventName).subscribe(e => {
            if (this.getEventHandler()) {
                this.getEventHandler().apply(this, [e]);
            } else {
                this.handleEvent.apply(this, [e]);
            }
        });
    }

    abstract handleEvent(e: K): void;
}

/**
 * Abstract service for handling event from the specified element
 * @param <T> element type to handle event
 * @param <K> event type
 */
export abstract class AbstractKeyboardEventHandlerService<T> extends AbstractEventHandlerService<T, KeyboardEvent> {

    @Output() onEnter = new EventEmitter<KeyboardEvent>();
    @Output() onEsc = new EventEmitter<KeyboardEvent>();

    protected constructor(target: FromEventTarget<T>, eventName: string,
                          eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                          @Inject(NGXLogger) logger: NGXLogger) {
        super(target, eventName, eventHandlerDelegate, logger);
    }

    protected getKey(e: KeyboardEvent) {
        return e.key || e.keyCode;
    }

    protected isEnterKey(e: KeyboardEvent) {
        return KeyboardUtils.isEnterKey(e);
    }

    protected isEscKey(e: KeyboardEvent) {
        return KeyboardUtils.isEscKey(e);
    }

    handleEvent(e: KeyboardEvent): void {
        if (this.isEnterKey(e)) {
            this.onEnter.emit(e);

        } else if (this.isEscKey(e)) {
            this.onEsc.emit(e);
        }
    }
}

/**
 * Abstract service for handling `keypress` event from the specified element
 * @param <T> element type to handle event
 */
export abstract class AbstractKeypressEventHandlerService<T> extends AbstractKeyboardEventHandlerService<T> {
    protected constructor(target: FromEventTarget<T>,
                          eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                          @Inject(NGXLogger) logger: NGXLogger) {
        super(target, 'keypress', eventHandlerDelegate, logger);
    }
}

/**
 * Abstract service for handling `keydown` event from the specified element
 * @param <T> element type to handle event
 */
export abstract class AbstractKeydownEventHandlerService<T> extends AbstractKeyboardEventHandlerService<T> {
    protected constructor(target: FromEventTarget<T>,
                          eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                          @Inject(NGXLogger) logger: NGXLogger) {
        super(target, 'keydown', eventHandlerDelegate, logger);
    }
}

/**
 * Abstract service for handling `keyup` event from the specified element
 * @param <T> element type to handle event
 */
export abstract class AbstractKeyupEventHandlerService<T> extends AbstractKeyboardEventHandlerService<T> {
    protected constructor(target: FromEventTarget<T>,
                          eventHandlerDelegate: SubscribeHandler<KeyboardEvent>,
                          @Inject(NGXLogger) logger: NGXLogger) {
        super(target, 'keyup', eventHandlerDelegate, logger);
    }
}

import {
    CONTEXT_MENU,
    DELETE,
    DOWN_ARROW,
    END,
    ENTER,
    ESCAPE,
    HOME,
    INSERT,
    PAGE_DOWN,
    PAGE_UP,
    UP_ARROW,
} from '@angular/cdk/keycodes';

/**
 * Keyboard utilities
 */
export default class KeyboardUtils {
    /**
     * Support to detect the specified KeyboardEvent whether is raised from the specified keys array
     * @param e to parse key
     * @param detectedKeys to detect
     * @return true for the event whether came from one of the specified keys; else false
     */
    public static isSpecifiedKey(e: KeyboardEvent, ...detectedKeys: any[]): boolean {
        if (!e || !detectedKeys || !detectedKeys.length) {
            return false;
        }
        const key = e.key || e.keyCode;
        return (detectedKeys.indexOf(key) >= 0 || detectedKeys.indexOf(e.keyCode) >= 0);
    }

    /**
     * Get a boolean value indicating event whether is from navigation keys
     * @param event KeyboardEvent
     */
    public static isNavigateKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event,
            'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown',
            UP_ARROW, DOWN_ARROW, HOME, END, PAGE_UP, PAGE_DOWN);
    }

    /**
     * Get a boolean value indicating event whether is from PAGE_UP key
     * @param event KeyboardEvent
     */
    public static isPageUpKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'PageUp', PAGE_UP);
    }

    /**
     * Get a boolean value indicating event whether is from PAGE_DOWN key
     * @param event KeyboardEvent
     */
    public static isPageDownKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'PageDown', PAGE_DOWN);
    }

    /**
     * Get a boolean value indicating event whether is from UP_ARROW key
     * @param event KeyboardEvent
     */
    public static isUpKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'ArrowUp', UP_ARROW);
    }

    /**
     * Get a boolean value indicating event whether is from DOWN_ARROW key
     * @param event KeyboardEvent
     */
    public static isDownKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'ArrowDown', DOWN_ARROW);
    }

    /**
     * Get a boolean value indicating event whether is from UP_ARROW key
     * @param event KeyboardEvent
     */
    public static isHomeKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'Home', HOME);
    }

    /**
     * Get a boolean value indicating event whether is from DOWN_ARROW key
     * @param event KeyboardEvent
     */
    public static isEndKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'End', END);
    }

    /**
     * Get a boolean value indicating event whether is from ENTER key
     * @param event KeyboardEvent
     */
    public static isEnterKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'Enter', ENTER);
    }

    /**
     * Get a boolean value indicating event whether is from ESC key
     * @param event KeyboardEvent
     */
    public static isEscKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'Escape', 'Esc', ESCAPE);
    }

    /**
     * Get a boolean value indicating event whether is from DELETE key
     * @param event KeyboardEvent
     */
    public static isDeleteKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'Delete', 'Del', DELETE);
    }

    /**
     * Get a boolean value indicating event whether is from INSERT key
     * @param event KeyboardEvent
     */
    public static isInsertKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'Insert', 'Ins', INSERT);
    }

    /**
     * Get a boolean value indicating event whether is from INSERT key
     * @param event KeyboardEvent
     */
    public static isContextMenuKey(event: KeyboardEvent): boolean {
        return KeyboardUtils.isSpecifiedKey(event, 'ContextMenu', CONTEXT_MENU);
    }
}

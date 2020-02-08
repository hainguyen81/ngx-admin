/**
 * The HTML focusable elements selector
 */
export const FOCUSABLE_ELEMENTS_SELETOR: string =
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';

/**
 * HTML utilities
 */
export default class HtmlUtils {
    /**
     * Get the DOM elements by the specified selector
     * @param selector to find
     * @param element parent element or document
     * @return DOM elements or undefined
     */
    public static getElementsBySelector(selector: string, element?: Element): NodeListOf<HTMLElement> {
        if (!(selector || '').length) {
            return undefined;
        }
        return (element || document).querySelectorAll(selector);
    }

    /**
     * Get the focusable DOM elements of the specified element
     * @param element to filter. undefined for filtering whole document
     * @return focusable DOM elements or undefined
     */
    public static getFocusableElements(element?: Element): NodeListOf<HTMLElement> {
        return HtmlUtils.getElementsBySelector(FOCUSABLE_ELEMENTS_SELETOR, element);
    }

    /**
     * Prevent the specified event
     * @param event to prevent
     */
    public static preventEvent(event: Event): boolean {
        if (!event) {
            return true;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.cancelBubble = true;
        event.returnValue = false;
        return false;
    }

    /**
     * Get the next sibling element of the specified element by the specified element selector
     * @param element to find next sibling element
     * @param selector to filter
     * @return next sibling element or undefined
     */
    public static nextSibling(element?: Element, selector?: string): Element {
        let siblingEl: Element;
        siblingEl = (element || document.body).nextElementSibling;
        if (!(selector || '').length || !siblingEl || siblingEl.matches(selector)) {
            return siblingEl;
        }
        return this.nextSibling(siblingEl, selector);
    }

    /**
     * Get the previous sibling element of the specified element by the specified element selector
     * @param element to find previous sibling element
     * @param selector to filter
     * @return previous sibling element or undefined
     */
    public static previousSibling(element?: Element, selector?: string): Element {
        let siblingEl: Element;
        siblingEl = (element || document.body).previousElementSibling;
        if (!(selector || '').length || !siblingEl || siblingEl.matches(selector)) {
            return siblingEl;
        }
        return this.nextSibling(siblingEl, selector);
    }
}

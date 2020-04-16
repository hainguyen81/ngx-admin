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
     * Get the first occurred DOM elements by the specified selector
     * @param selector to find
     * @param element parent element or document
     * @return DOM elements or undefined
     */
    public static getFirstElementBySelector(selector: string, element?: Element): HTMLElement {
        let elements: NodeListOf<HTMLElement>;
        elements = this.getElementsBySelector(selector, element);
        return (elements && elements.length ? elements.item(0) : undefined);
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
     * Get the first occurred focusable DOM elements of the specified element
     * @param element to filter. undefined for filtering whole document
     * @return focusable DOM elements or undefined
     */
    public static getFirstFocusableElement(element?: Element): HTMLElement {
        let elements: NodeListOf<HTMLElement>;
        elements = this.getFocusableElements(element);
        return (elements && elements.length ? elements.item(0) : undefined);
    }

    /**
     * Prevent the specified event
     * @param event to prevent
     */
    public static preventEvent(event: any): boolean {
        const evt: Event = <Event>event;
        if (!evt) {
            return true;
        }

        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        evt.cancelBubble = true;
        evt.returnValue = false;
        return false;
    }

    /**
     * Get the next/previous sibling element of the specified element by the specified element selector
     * @param next true for next sibling; else previous
     * @param element to find next/previous sibling element
     * @param selector to filter
     * @return next/previous sibling element or undefined
     */
    public static sibling(next?: boolean | true, element?: Element, selector?: string): Element {
        let siblingEl: Element;
        siblingEl = (next ? (element || document.body).nextElementSibling
            : (element || document.body).previousElementSibling);
        if (!(selector || '').length || !siblingEl || siblingEl.matches(selector)) {
            return siblingEl;
        }
        return this.sibling(next, siblingEl, selector);
    }

    /**
     * Get the next sibling element of the specified element by the specified element selector
     * @param element to find next sibling element
     * @param selector to filter
     * @return next sibling element or undefined
     */
    public static nextSibling(element?: Element, selector?: string): Element {
        return this.sibling(true, element, selector);
    }

    /**
     * Get the previous sibling element of the specified element by the specified element selector
     * @param element to find previous sibling element
     * @param selector to filter
     * @return previous sibling element or undefined
     */
    public static previousSibling(element?: Element, selector?: string): Element {
        return this.sibling(false, element, selector);
    }

    /**
     * Get the next/previous any element of the specified element by the specified element selector
     * @param next true for next sibling; else previous
     * @param element to find next/previous element
     * @param selector to filter
     * @return next/previous element or undefined
     */
    public static walk(next?: boolean | true, element?: Element, selector?: string): Element {
        let elements: NodeListOf<HTMLElement>;
        elements = ((selector || '').length ? this.getElementsBySelector(selector)
            : this.getElementsBySelector('*'));
        if (!element) {
            return (next ? elements.item(0) : elements.item(elements.length - 1));
        }

        // loop for finding
        for (let i: number = 0; i < elements.length; i++) {
            if (elements.item(i) === element
                && (!(selector || '').length || elements.item(i).matches(selector))) {
                if (next && i < elements.length - 1) {
                    return elements.item(i + 1);

                } else if (!next && 0 < i) {
                    return elements.item(i - 1);
                }
            }
        }
        return undefined;
    }

    /**
     * Get the next any element of the specified element by the specified element selector
     * @param element to find next element
     * @param selector to filter
     * @return next element or undefined
     */
    public static next(element?: Element, selector?: string): Element {
        return this.walk(true, element, selector);
    }

    /**
     * Get the previous any element of the specified element by the specified element selector
     * @param element to find previous element
     * @param selector to filter
     * @return previous element or undefined
     */
    public static previous(element?: Element, selector?: string): Element {
        return this.walk(false, element, selector);
    }
}

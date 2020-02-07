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
}

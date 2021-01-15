/**
 * Timer utilities
 */
export default class TimerUtils {

    /**
     * Invoke the specified function after timeout
     * @param invoke to invoke
     */
    public static timeout(invoke: Function, timeout?: number | null | undefined, caller?: any, ...args: any[]): void {
        const timer: number = window.setTimeout(() => {
            invoke.apply(caller || this, args);
            window.clearTimeout(timer);
        }, timeout || 0);
    }
}

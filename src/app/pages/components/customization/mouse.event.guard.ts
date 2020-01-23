export class MouseEventGuard {
    static lastClickTime: number = 0;

    public static isDoubleClick(): boolean {
        let dc: boolean = false;
        dc = (MouseEventGuard.lastClickTime === 0 ? false
            : (((new Date().getTime()) - MouseEventGuard.lastClickTime) < 400));
        if (dc) {
            MouseEventGuard.lastClickTime = 0;
        } else {
            MouseEventGuard.lastClickTime = new Date().getTime();
        }
        return dc;
    }
}

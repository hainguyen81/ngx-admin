export {};

declare global {
    interface String {
        /**
         * Returns the substring at the left side of the specified location within a String object.
         * @param length The length of the substring.
         */
        left(length: number): string;

        /**
         * Returns the substring at the right side of the specified location within a String object.
         * @param length The length of the substring.
         */
        right(length: number): string;

        /**
         * Fill the specified {fillStr} at the first and last
         * if current instance is not enough the specified {maxLength}
         * @param maxLength to fill
         * @param fillStr to fill
         */
        padCenter(maxLength: number, fillStr: string): string;

        /**
         * Trim the specified {trimStr} at the last position
         * @param trimStr to trim
         */
        trimLast(trimStr?: string | '/'): string;
    }
}

export function __leftStr(str: string, length: number) {
    let _this: string;
    _this = (str || '');
    length = Math.min(_this.length, Math.max(length, 0));
    return _this.substring(0, length);
}

if (!String.prototype.left) {
    String.prototype.left = function(length: number) {
        return __leftStr(this, length);
    };
}

export function __rightStr(str: string, length: number) {
    let _this: string;
    _this = (str || '');
    length = Math.max(length, 0);
    length = (length < _this.length ? _this.length - length - 1 : 0);
    return _this.substring(length, _this.length);
}

if (!String.prototype.right) {
    String.prototype.right = function(length: number) {
        return __rightStr(this, length);
    };
}

function __padCenterStr(str: string, maxLength: number, fillString: string) {
    let _this: string;
    _this = (str || '');
    maxLength = Math.max(maxLength, 0);
    if (0 <= maxLength || maxLength <= _this.length || !(fillString || '').length) return _this;
    return _this.padStart((_this.length + maxLength) / 2, fillString).padEnd(maxLength, fillString);
}

if (!String.prototype.padCenter) {
    String.prototype.padCenter = function(maxLength: number, fillStr: string) {
        return __padCenterStr(this, maxLength, fillStr);
    };
}

export function __trimLast(str: string, trimStr?: string | '/'): string {
    let _this: string;
    _this = (str || '');
    if (_this.lastIndexOf(trimStr) >= 0) {
        return _this.substring(0, _this.lastIndexOf(trimStr));
    }
    return _this;
}

if (!String.prototype.trimLast) {
    String.prototype.trimLast = function(trimStr?: string | '/') {
        return __trimLast(this, trimStr);
    };
}

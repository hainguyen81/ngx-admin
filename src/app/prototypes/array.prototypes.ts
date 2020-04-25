export {};

declare global {
    interface Array<T> {
        /**
         * Remove items if they match the specified condition function.
         * @param condition function with item as parameter to check
         */
        removeIf(condition: (item: T, index?: number) => boolean): T[];

        /**
         * Remove the specified items out of the present array
         * @param items to remove
         */
        remove(...items: T[]): void;

        /**
         * Remove all items in the present instance
         */
        clear(): void;

        /**
         * Inject the specified {items} into the present instance at the specified {index}
         * @param index to inject
         * @param items to inject
         */
        inject(index: number, ...items: T[]): void;

        /**
         * Get the first item of the present instance
         */
        first(): T;

        /**
         * Get the last item of the present instance
         */
        last(): T;

        /**
         * Clone the non-duplicated items from the present instance
         */
        unique(): T[];

        /**
         * Get a boolean value indicating that the specified {item} whether existed in the present instance
         * @param item to check
         */
        contains(item: T): boolean;

        /**
         * Get the difference items between the present instance and the specified {other}
         * @param other to compare
         */
        diff(other: Array<T> | T[]): T[];

        /**
         * Get a boolean value indicating the present instance is difference by items
         * with the specified {other}
         * @param other to compare
         */
        isDiff(other: Array<T> | T[]): boolean;
    }
}

export function __removeIf<T>(array: Array<T> | T[], condition: (item: T, index?: number) => boolean) {
    let retArray: T[];
    retArray = [].concat(array || []);
    if (typeof condition === 'function') {
        let index: number;
        index = 0;
        while (index < retArray.length) {
            if (condition.apply(retArray, [retArray[index], index])) {
                retArray.splice(index, 1);

            } else {
                ++index;
            }
        }
    }
    return retArray;
}

if (!Array.prototype.removeIf) {
    Array.prototype.removeIf = function<T>(condition: (item: T, index?: number) => boolean) {
        return __removeIf<T>(this, condition);
    };
}

export function __remove<T>(array: Array<T> | T[], ...items: T[]) {
    let itemIdx: number;
    let arrayIndex: number;
    let remItem: T;
    itemIdx = (items || []).length;
    while (itemIdx && (array || []).length) {
        remItem = items[--itemIdx];
        while ((arrayIndex = (array || []).indexOf(remItem)) !== -1) {
            (array || []).splice(arrayIndex, 1);
        }
    }
}

if (!Array.prototype.remove) {
    Array.prototype.remove = function<T>(...items: T[]) {
        return __remove<T>(this, ...items);
    };
}

if (!Array.prototype.clear) {
    Array.prototype.clear = function<T>() {
        return this.splice(0, this.length);
    };
}

if (!Array.prototype.first) {
    Array.prototype.first = function<T>() {
        return (this.length ? this[0] : null);
    };
}
if (!Array.prototype.last) {
    Array.prototype.last = function<T>() {
        return (this.length ? this[this.length - 1] : null);
    };
}

export function __inject<T>(array: Array<T> | T[], index: number, ...items: T[]) {
    let subItems: T[];
    subItems = [];
    if (items instanceof Array
        || Object.prototype.toString.call(items) === '[object Array]') {
        subItems = [].concat(items);
    } else if (items) {
        subItems.push(items);
    }
    if (subItems.length && !isNaN(index) && 0 <= index && index < this.length) {
        (array || []).splice(index + 1, 0, ...subItems);
    }
}

if (!Array.prototype.inject) {
    Array.prototype.inject = function<T>(index: number, ...items: T[]) {
        __inject<T>(this, index, ...items);
    };
}

export function __unique<T>(array: Array<T> | T[]): T[] {
    let cloned: T[];
    cloned = (array || []).concat();
    if ((cloned || []).length) {
        for (let i: number = 0; i < cloned.length; i++) {
            for (let j: number = i + 1; j < cloned.length; j++) {
                if (cloned[i] === cloned[j]) cloned.splice(j--, 1);
            }
        }
    }
    return cloned;
}

if (!Array.prototype.unique) {
    Array.prototype.unique = function<T>() {
        return __unique<T>(this);
    };
}

if (!Array.prototype.contains) {
    Array.prototype.contains = function(item) {
        return (this.length && this.indexOf(item) >= 0);
    };
}

export function __diff<T>(a: Array<T> | T[], b: Array<T> | T[]): T[] {
    let diffItems: T[];
    diffItems = [];
    let clonedB: T[];
    clonedB = (b || []).concat([]);
    for (let i: number = 0; i < (a || []).length; i++) {
        if (!clonedB.contains(a[i])) {
            diffItems.push(a[i]);
        } else {
            clonedB.splice(clonedB.indexOf(a[i]), 1);
        }
    }
    for (let i: number = 0; i < clonedB.length; i++) {
        if (!diffItems.contains(clonedB[i])) {
            diffItems.push(clonedB[i]);
        }
    }
    return diffItems;
}

if (!Array.prototype.diff) {
    Array.prototype.diff = function<T>(other: Array<T> | T[]): T[] {
        return __diff<T>(this, other);
    };
}

export function __isDiff<T>(a: Array<T> | T[], b: Array<T> | T[]): boolean {
    let isDiff: boolean;
    isDiff = ((b || []).length !== (a || []).length);
    if (!isDiff) {
        for (let i: number = 0; i < (a || []).length; i++) {
            if (!(b || []).contains(a[i])) {
                isDiff = true;
                break;
            }
        }
    }
    return isDiff;
}

if (!Array.prototype.isDiff) {
    Array.prototype.isDiff = function<T>(other: Array<T> | T[]): boolean {
        return __isDiff<T>(this, other);
    };
}

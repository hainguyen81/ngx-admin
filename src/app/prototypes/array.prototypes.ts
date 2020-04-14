export {};

declare global {
    interface Array<T> {
        /**
         * Remove items if they match the specified condition function.
         * @param condition function with item as parameter to check
         */
        removeIf(condition: (item: T, index?: number) => boolean): T[];
    }
}

if (!Array.prototype.removeIf) {
    Array.prototype.removeIf = function<T>(condition: (item: T, index?: number) => boolean) {
        let retArray: T[];
        retArray = [].concat(this);
        if (typeof condition === 'function') {
            let index: number;
            index = 0;
            while (index < this.length) {
                if (condition.apply(retArray, [retArray[index], index])) {
                    retArray.splice(index, 1);

                } else {
                    ++index;
                }
            }
        }
        return retArray;
    };
}

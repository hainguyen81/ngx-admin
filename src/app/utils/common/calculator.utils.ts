import NumberUtils from './number.utils';

export default class CalculatorUtils {

    /**
     * Calculate to `plus` the specified values
     * @param val1 to calculate
     * @param val2 to calculate
     * @return the sum of the specified values
     */
    public static plus(val1: any, val2: any): number {
        if (!NumberUtils.isNumber(val1) && !NumberUtils.isNumber(val2)) {
            return undefined;

        } else if (!NumberUtils.isNumber(val1) && NumberUtils.isNumber(val2)) {
            return parseFloat(val2);

        } else if (NumberUtils.isNumber(val1) && !NumberUtils.isNumber(val2)) {
            return parseFloat(val1);
        }
        return parseFloat(val1) + parseFloat(val2);
    }

    /**
     * Calculate to `plus` the specified values
     * @param values to calculate
     * @return the sum of the specified values
     */
    public static plusMulti(...values): number {
        return (values || []).reduce(this.plus);
    }

    /**
     * Calculate to `multiply` the specified values
     * @param val1 to calculate
     * @param val2 to calculate
     * @return the multiplied value of the specified values
     */
    public static multiply(val1, val2): number {
        if (!NumberUtils.isNumber(val1) && !NumberUtils.isNumber(val2)) {
            return undefined;

        } else if (!NumberUtils.isNumber(val1) && NumberUtils.isNumber(val2)) {
            return parseFloat(val2);

        } else if (NumberUtils.isNumber(val1) && !NumberUtils.isNumber(val2)) {
            return parseFloat(val1);
        }
        return parseFloat(val1) * parseFloat(val2);
    }

    /**
     * Calculate to `multiply` the specified values
     * @param values to calculate
     * @return the multiplied value of the specified values
     */
    public static multiplyMulti(...values: any[]): number {
        return (values || []).reduce(this.multiply);
    }
}

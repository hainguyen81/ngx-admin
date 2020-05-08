/**
 * Mix the specified base prototype to the delivered prototype
 * @param deliveredCtor to delivery
 * @param baseCtors base prototypes
 */
export function mixins(deliveredCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (!deliveredCtor.prototype[name]) {
                Object.defineProperty(deliveredCtor.prototype, name,
                    Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            }
        });
    });
}

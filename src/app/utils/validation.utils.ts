export default class ValidationUtils {

    public static VALIDATION_CODE_PATTERN: RegExp = /^[a-zA-Z0-9_-]{4,16}$/g;
    public static VALIDATION_PASSWORD_PATTERN: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$/g;
}

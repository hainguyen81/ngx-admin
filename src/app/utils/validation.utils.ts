export default class ValidationUtils {

    public static VALIDATION_CODE_PATTERN: RegExp = /^\S+\w{1,16}\S{1,}/g;
    public static VALIDATION_PASSWORD_PATTERN: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$/g;
}

export default class ValidationUtils {

    public static VALIDATION_CODE_PATTERN: RegExp = /^(?=^.{12}$)[A-Z]{1,2}\d*$/g;
    public static VALIDATION_PASSWORD_PATTERN: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$/g;
}

export default class FormErrors {
    constructor(imageError = false, emailError = false, emailNotPresent = false, pinError = false, privacyError = false) {
        this.imageError = imageError;
        this.emailError = emailError;
        this.emailNotPresent = emailNotPresent;
        this.pinError = pinError;
        this.privacyError = privacyError;
    }
}
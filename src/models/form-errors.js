export default class FormErrors {
    constructor(imageError = false, emailError = false, privacyError = false) {
        this.imageError = imageError;
        this.emailError = emailError;
        this.privacyError = privacyError;
    }
}
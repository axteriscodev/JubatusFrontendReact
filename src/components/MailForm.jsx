import { useState } from "react";
import { FormLabel } from "../shared/components/ui/Form";
import Input from "../shared/components/ui/Input";
import Modal from "../shared/components/ui/Modal";
import Button from "../shared/components/ui/Button";
import { useTranslations } from "../features/TranslationProvider";
import parse from "html-react-parser";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

export default function MailForm({
  defaultEmail,
  submitHandle,
  showPrivacy = true,
  onErrors,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [emailValue, setEmailValue] = useState(defaultEmail || "");
  const [show, setShow] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (event) => {
    setShow(true);
    event.preventDefault();
  };

  const handlePrivacyPolicyClose = () => setShowPrivacyPolicy(false);
  const handlePrivacyPolicyShow = (event) => {
    setShowPrivacyPolicy(true);
    event.preventDefault();
  };

  const { t } = useTranslations();

  const handlePrivacyChange = (event) => {
    const newValue = event.target.checked;
    setIsChecked(newValue);
  };

  return (
    <div className="text-left">
      <FormLabel>{t("EMAIL_EMAIL")}</FormLabel>
      <Input
        type="email"
        name="email"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        placeholder={t("EMAIL_ENTER")}
        error={
          onErrors.emailError ||
          onErrors.emailNotPresent ||
          onErrors.emailDuplicated
        }
      />
      {onErrors.emailError && <p className="on-error">{t("EMAIL_VALID")}</p>}
      {onErrors.emailNotPresent && (
        <p className="on-error">{t("EMAIL_NOTHING")}</p>
      )}
      {onErrors.emailDuplicated && (
        <p className="on-error">{t("EMAIL_DUPLICATED")}</p>
      )}
      <div className="my-xs">
        {showPrivacy && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={isChecked}
                onChange={handlePrivacyChange}
                className="w-11 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer transition-colors duration-200 checked:bg-blue-600 relative
                  before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:duration-200
                  checked:before:translate-x-5"
              />
              <label
                className="text-base cursor-pointer"
                htmlFor="flexSwitchCheckDefault"
              >
                {t("SELFIE_PRIVACY")}
              </label>
              <a
                href="#"
                className="text-base text-secondary-event hover:underline"
                onClick={handleShow}
              >
                {t("SELFIE_PRIVACY2")}
              </a>
            </div>

            {/* Modal breve con info privacy */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton onHide={handleClose}>
                <Modal.Title>
                  <span className="text-black">{t("PRIVACY_TITLE")}</span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="text-black">{t("PRIVACY_CONTENT")}</p>
                <p className="text-black">
                  {t("PRIVACY_DETAILS")}
                  <a
                    href="#"
                    onClick={handlePrivacyPolicyShow}
                    className="text-black underline hover:no-underline"
                  >
                    {t("EMAIL_PRIVACY")}
                  </a>
                  .
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                  {t("PRIVACY_CLOSE")}
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal completo Privacy Policy */}
            <PrivacyPolicyModal
              show={showPrivacyPolicy}
              onHide={handlePrivacyPolicyClose}
            />
          </>
        )}
        {onErrors.privacyError && (
          <p className="on-error">{t("EMAIL_ACCEPT")}</p>
        )}
      </div>
      <button
        className="my-button w-full mt-sm"
        onClick={(event) =>
          submitHandle(event, {
            email: emailValue,
            privacy: isChecked,
          })
        }
      >
        {parse(t("SELFIE_NEXT"))}
      </button>
    </div>
  );
}

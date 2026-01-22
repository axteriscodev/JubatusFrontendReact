import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
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
    <div className="text-start">
      <Form.Label>{t("EMAIL_EMAIL")}</Form.Label>
      <Form.Control
        type="email"
        name="email"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        placeholder={t("EMAIL_ENTER")}
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
            <div className="form-check form-switch switch-scale">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={isChecked}
                onChange={handlePrivacyChange}
              />
              <label
                className="form-check-label text-10"
                htmlFor="flexSwitchCheckDefault"
              >
                {t("SELFIE_PRIVACY")}
              </label>{" "}
              <a href="#" className="text-10" onClick={handleShow}>
                {t("SELFIE_PRIVACY2")}
              </a>
            </div>

            {/* Modal breve con info privacy */}
            <Modal show={show} onHide={handleClose} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>
                  <font className="text-black">{t("PRIVACY_TITLE")}</font>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="text-black">{t("PRIVACY_CONTENT")}</p>
                <p className="text-black">
                  {t("PRIVACY_DETAILS")}
                  <a
                    href="#"
                    onClick={handlePrivacyPolicyShow}
                    className="text-black"
                  >
                    {t("EMAIL_PRIVACY")}
                  </a>
                  .
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={handleClose}>
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
        className="my-button w-100 mt-sm"
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

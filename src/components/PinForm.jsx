import { useRef } from "react";
import Form from "react-bootstrap/Form";
import { useTranslations } from "../features/TranslationProvider";


export default function PinForm({ submitHandle, onErrors }) {
  const pin = useRef();
  const { t } = useTranslations();

  return (
    <div className="text-start">
      <Form.Label>PIN</Form.Label>
      <Form.Control
        ref={pin}
        type="text"
        name="pin"
        placeholder="PIN"
      />
      {onErrors.pinError && <p className="on-error">{t("PERSONAL_PIN_INVALID")}</p>}

      <button
        className="my-button w-100 mt-sm"
        onClick={(event) => submitHandle(event, { pin: pin.current.value?.trim() })}
      >
        Avanti
      </button>
    </div>
  );
}

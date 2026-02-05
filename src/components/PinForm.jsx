import { useRef } from "react";
import { FormLabel } from "../shared/components/ui/Form";
import Input from "../shared/components/ui/Input";
import { useTranslations } from "../features/TranslationProvider";

export default function PinForm({ submitHandle, onErrors }) {
  const pin = useRef();
  const { t } = useTranslations();

  return (
    <div className="text-left">
      <FormLabel>PIN</FormLabel>
      <Input
        ref={pin}
        type="text"
        name="pin"
        placeholder="PIN"
        error={!!onErrors.pinError}
      />
      {onErrors.pinError && <p className="on-error">{t("PERSONAL_PIN_INVALID")}</p>}

      <button
        className="my-button w-full mt-10"
        onClick={(event) => submitHandle(event, { pin: pin.current.value?.trim() })}
      >
        Avanti
      </button>
    </div>
  );
}

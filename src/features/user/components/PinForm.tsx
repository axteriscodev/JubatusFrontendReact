import { useRef, type MouseEvent } from "react";
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";
import { useTranslations } from "@common/i18n/TranslationProvider";
import type { FormErrors } from "@common/models/form-errors";

interface PinFormProps {
  submitHandle: (event: MouseEvent<HTMLButtonElement>, data: { pin: string }) => void;
  onErrors: FormErrors;
}

export default function PinForm({ submitHandle, onErrors }: PinFormProps) {
  const pin = useRef<HTMLInputElement>(null);
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
        onClick={(event) => submitHandle(event, { pin: pin.current?.value?.trim() ?? "" })}
      >
        Avanti
      </button>
    </div>
  );
}

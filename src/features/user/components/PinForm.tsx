import { useRef, type SubmitEvent } from "react";
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";
import { useTranslations } from "@common/i18n/TranslationProvider";
import type { FormErrors } from "@common/models/form-errors";

interface PinFormProps {
  submitHandle: (data: { pin: string }) => void | Promise<void>;
  onErrors: FormErrors;
}

export default function PinForm({ submitHandle, onErrors }: PinFormProps) {
  const pin = useRef<HTMLInputElement>(null);
  const { t } = useTranslations();
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitHandle({ pin: pin.current?.value?.trim() ?? "" });
  };

  return (
    <form className="text-left" onSubmit={handleSubmit}>
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
        type="submit"
        className="my-button w-full mt-10"
      >
        Avanti
      </button>
    </form>
  );
}

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@common/store/hooks";
import { useTranslations } from "@common/i18n/TranslationProvider";
import MailForm from "@common/components/MailForm";
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";
import { useEmailConfirmation } from "../hooks/useEmailConfirmation";
import { ROUTES } from "@/routes";

export default function PayAtCounter() {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const userEmail = useAppSelector((state) => state.cart.userEmail);
  const eventSlug = useAppSelector((state) => state.competition.slug);

  const { name, nameError, formErrors, handleNameChange, handleSubmit } =
    useEmailConfirmation(() => {
      navigate(ROUTES.EVENT(eventSlug), { replace: true });
    });

  return (
    <div className="form-sm justify-center gap-4 px-6">
      <div className="my-8 text-left">
        <h2 className="mb-4">{t("EXTERNAL_PAYMENT_TITLE")}</h2>
        <p>{t("EXTERNAL_PAYMENT_TEXT")}</p>
      </div>

      <div className="mb-3 text-left">
        <FormLabel htmlFor="name">{t("NAME_CONFIRM_LABEL")}</FormLabel>
        <Input
          type="text"
          className={`${nameError ? "is-invalid" : ""}`}
          id="name"
          value={name}
          onChange={handleNameChange}
          placeholder={t("NAME_PLACEHOLDER")}
        />
        {nameError && (
          <div className="invalid-feedback">{t("NAME_REQUIRED")}</div>
        )}
      </div>

      <MailForm
        submitHandle={handleSubmit}
        defaultEmail={userEmail ?? ""}
        showPrivacy={false}
        onErrors={formErrors}
        externalPayment={true}
      />
    </div>
  );
}

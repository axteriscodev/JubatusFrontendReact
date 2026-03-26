import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@common/store/hooks";
import { useTranslations } from "@common/i18n/TranslationProvider";
import MailForm from "@common/components/MailForm";
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";
import { useEmailConfirmation } from "../hooks/useEmailConfirmation";
import parse from "html-react-parser";
import { ROUTES } from "@/routes";

export default function MailConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  // isCash viene passato come state da useCreateOrder quando il pagamento è in cassa (id=2)
  const isCash = (location.state as { isCash?: boolean } | null)?.isCash === true;
  const userEmail = useAppSelector((state) => state.cart.userEmail);
  const { t } = useTranslations();

  const { name, nameError, formErrors, handleNameChange, handleSubmit } =
    useEmailConfirmation(() => {
      navigate(isCash ? ROUTES.THANK_YOU_CASH : ROUTES.THANK_YOU);
    });

  // Se email o nome sono vuoti, mostriamo il form di inserimento invece della conferma
  const isEmailEmpty = !userEmail || userEmail.trim() === "";
  const isNameEmpty = !name || name.trim() === "";

  return (
    <div className="form-sm">
      <div className="my-20 text-left">
        {isEmailEmpty || isNameEmpty ? (
          <>
            <h2 className="mb-10">{t(isCash ? "ORDER_DETAILS" : "PAYMENT_COMPLETED")}</h2>
            <h4 className="">{t("EMAIL_ENTER")}</h4>
            <p>{t("EMAIL_AREA")}</p>
          </>
        ) : (
          <>
            <h2 className="mb-10">{t(isCash ? "ORDER_DETAILS" : "PAYMENT_COMPLETED")}</h2>
            <p>
              {parse(t("PAYMENT_ACCESS").replace("$email", userEmail))} <br />
              {t("PAYMENT_CORRECT")}
            </p>
          </>
        )}
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
        externalPayment={false}
      />
    </div>
  );
}

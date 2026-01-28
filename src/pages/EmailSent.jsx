import { useTranslations } from "../features/TranslationProvider";

export default function EmailSent() {
  const { t } = useTranslations();

  return (
    <div className="form form-sm">
      {/* <h1 className="mb-20">Accedi ai tuoi contenuti!</h1> */}
      <h1>{t("EMAIL_SENT")}</h1>
      {/* <PinForm submitHandle={handleSubmit} onErrors={formErrors} /> */}
    </div>
  );
}

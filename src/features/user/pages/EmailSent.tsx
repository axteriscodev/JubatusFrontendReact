import { useTranslations } from "@common/i18n/TranslationProvider";

export default function EmailSent() {
  const { t } = useTranslations();

  return (
    <div className="form form-sm">
      <h1>{t("EMAIL_SENT")}</h1>
    </div>
  );
}

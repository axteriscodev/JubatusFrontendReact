import { useTranslations } from "@/common/i18n/TranslationProvider";
import { useAppSelector } from "@/common/store/hooks";
import { useTimeoutRedirect } from "@common/hooks/useTimeoutRedirect";
import parse from "html-react-parser";

export default function ThankYouCash() {
  const eventPreset = useAppSelector((state) => state.competition);
  const { t } = useTranslations();

  useTimeoutRedirect(
    "/event/" + eventPreset.slug,
    Number(import.meta.env.VITE_THANKYOU_CASH_TIMEOUT) || 8000,
    { replace: true },
  );

  return (
    <div>
      <h1> {parse(t("PURCHASE_TITLE"))}</h1>
      <p>{parse(t("PURCHASE_CASH"))}</p>
    </div>
  );
}

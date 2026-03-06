import { useTranslations } from "@/common/i18n/TranslationProvider";
import { useAppSelector } from "@/common/store/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

export default function ThankYouCash() {
  const navigate = useNavigate();
  const eventPreset = useAppSelector((state) => state.competition);
  const { t } = useTranslations();

  //pagina timeout
  useEffect(() => {
    const timeOut = setTimeout(() => {
      navigate("/event/" + eventPreset.slug, { replace: true });
    }, 10000);

    // cleanup function
    return () => clearTimeout(timeOut);
  }, []);

  return (
    <div>
      <h1> {parse(t("PURCHASE_TITLE"))}</h1>
      <p>{parse(t("PURCHASE_CASH"))}</p>
    </div>
  );
}

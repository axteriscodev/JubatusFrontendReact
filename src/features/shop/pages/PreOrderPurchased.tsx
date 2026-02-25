import { useEffect } from "react";
import { useAppSelector } from "@common/store/hooks";
import { Link } from "react-router-dom";
import Logo from "@common/components/Logo";
import { setUiPreset } from "@common/utils/graphics";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from 'html-react-parser';
import { ROUTES } from "@/routes";

export default function PreOrderPurchased() {
  const eventPreset = useAppSelector((state) => state.competition);
  const { t } = useTranslations();

  //carico tema evento
  useEffect(() => {
    setUiPreset(eventPreset);
  }, []);

  return (
    <>
      <div className="container">
        <Link to={ROUTES.EVENT(eventPreset.slug)}>
          <Logo
            src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
          />
        </Link>
        <h2 className="mt-20">{parse(t('PURCHASE_TITLE'))}</h2>
        <p>{t("PREORDER_EMAIL")}</p>
      </div>
    </>
  );
}

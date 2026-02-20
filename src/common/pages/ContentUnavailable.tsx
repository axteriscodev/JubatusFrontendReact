import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useTranslations } from "../i18n/TranslationProvider";
import parse from "html-react-parser";
import { ROUTES } from "@/routes";
import { useAppSelector } from "@common/store/hooks";

export default function ContentUnavailable() {
  const eventPreset = useAppSelector((state) => state.competition);
  const navigate = useNavigate();
  const { t } = useTranslations();

  const buttonHandle = () => {
    navigate(ROUTES.EVENT(eventPreset.slug));
  };

  return (
    <div className="form-sm">
      <Logo
        src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
        size="logo-sm"
        css="mb-10"
      />
      <div>{parse(t("WAITING_NOTHING"))}</div>
      <h2>{eventPreset.emoji ?? "📷 ⌛ 📧"}</h2>

      <button className="my-button w-full mt-10" onClick={buttonHandle}>
        {t("WAITING_BACK")}
      </button>
    </div>
  );
}

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useTranslations } from "../features/TranslationProvider";
import parse from 'html-react-parser';

export default function ContentError() {
  const eventPreset = useSelector((state) => state.competition);
  const navigate = useNavigate();
  const { t } = useTranslations();

  const buttonHandle = (event) => {
    navigate("/event/" + eventPreset.slug);
  };

  return (
    <div className="form-sm">
      <Logo
        src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
        size="logo-sm"
        css="mb-sm"
      />
      {parse(t('ERROR_UNEXPECTED'))}
      <h2>{eventPreset.emoji ?? "🚴 📸 🏃"}</h2>
      {/* <div
        className="progress mt-md"
        role="progressbar"
        aria-label="Basic example"
        aria-valuenow="25"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-bar" style={{ width: "25%" }}></div>
      </div>
      Caricamento */}

      <button className="my-button w-100 mt-sm" onClick={buttonHandle}>
        {t('WAITING_BACK')}
      </button>
    </div>
  );
}

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useTranslations } from "../features/TranslationProvider";

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
      <h2>C'è stato un errore imprevisto,</h2>
      <h2>ma non ti preoccupare,</h2>
      <h2>i tuoi acquisti saranno presto disponibili!</h2>
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

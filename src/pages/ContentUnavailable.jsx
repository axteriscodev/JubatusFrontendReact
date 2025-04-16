import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function ContentUnavailable() {
  const eventPreset = useSelector((state) => state.competition);
  const navigate = useNavigate();

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
      <h2>Peccato, foto e video non ancora disponibili.</h2>
      <h2>Tieni d'occhio la mail: ti scriveremo appena pronte!</h2>
      <h2>{eventPreset.emoji ?? "📷 ⌛ 📧"}</h2>
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
        Torna indietro
      </button>
    </div>
  );
}

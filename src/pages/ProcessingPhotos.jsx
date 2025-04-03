import Logo from "../components/Logo";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProcessingPhotos() {
  const eventPreset = useSelector((state) => state.competition);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--bg-color",
      eventPreset.backgroundColor
    );
    document.documentElement.style.setProperty(
      "--font-color",
      eventPreset.fontColor
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/purchased");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="form-sm">
      <Logo
        src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
        size="logo-sm"
        css="mb-sm"
      />
      <h2>
        Ci siamo <span>campione</span> !
      </h2>
      <h4 className="mt-sm mb-md">
        Stiamo elaborando
        <br />i tuoi contenuti in <span>MASSIMA</span> risoluzione
        <br />
        🌊 📸 🏄🏻
      </h4>
      <div
        className="progress mt-md"
        role="progressbar"
        aria-label="Basic example"
        aria-valuenow="25"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-bar" style={{ width: "25%" }}></div>
      </div>
      Caricamento
    </div>
  );
}

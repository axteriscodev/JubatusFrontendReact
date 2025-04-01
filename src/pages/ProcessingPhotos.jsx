import Logo from "../components/Logo";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function ProcessingPhotos() {
  const eventPreset = useSelector((state) => state.competition);

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

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto my-bg-color">
      <Logo
        src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
        size="logo-sm"
        css="mb-sm"
      />
      <h2>
        Ci siamo <span className="my-font-color">campione</span> !
      </h2>
      <h4 className="mt-sm mb-md">
        Stiamo elaborando
        <br />i tuoi contenuti in <span className="my-font-color">
          MASSIMA
        </span>{" "}
        risoluzione
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

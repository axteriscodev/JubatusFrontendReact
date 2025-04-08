import Logo from "../components/Logo";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartActions } from "../repositories/cart/cart-slice";
import { setUiPreset } from "../utils/graphics";
import { listenSSE } from "../services/api-services";

export default function ProcessingPhotos() {
  const eventPreset = useSelector((state) => state.competition);
  const orderId = useSelector((state) => state.cart.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // document.documentElement.style.setProperty(
    //   "--bg-color",
    //   eventPreset.backgroundColor
    // );
    // document.documentElement.style.setProperty(
    //   "--font-color",
    //   eventPreset.fontColor
    // );

    setUiPreset(eventPreset);
  }, []);

  useEffect(() => {
    listenSSE(
      import.meta.env.VITE_API_URL + "/shop/purchased-contents/" + orderId,
      (data) => {
        const jsonData = JSON.parse(data);
        dispatch(cartActions.setPurchasedItems(jsonData.contents));
        navigate("/purchased", { replace: true });

        //dispatch(cartActions.updateUserId(jsonData.userId));
        

        // if (jsonData.contents.length > 0) {
        //   navigate("/image-shop", { replace: true });
        // } else {
        //   navigate("/content-unavailable", { replace: true });
        // }
      },
      () => {
        console.log("Errore!");
      }
    );
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

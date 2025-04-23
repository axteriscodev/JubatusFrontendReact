import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { setUiPreset } from "../utils/graphics";

export default function PreOrderPurchased() {
    const eventPreset = useSelector((state) => state.competition);

    //carico tema evento
    useEffect(() => {
        setUiPreset(eventPreset);
    }, []);

    return (
        <>
            <div className="container">
                <Link to={'/event/' + eventPreset.slug}>
                    <Logo
                        src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
                    />
                </Link>
                <h2 className="mt-md">Grazie per il <strong>tuo</strong> acquisto!</h2>
                <p>Riceverai una comunicazione per e-mail appena i tuoi contenuti saranno disponibili.</p>
            </div>
        </>
    );
}
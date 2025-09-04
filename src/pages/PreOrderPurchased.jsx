import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { setUiPreset } from "../utils/graphics";
import { useTranslations } from "../features/TranslationProvider";
import parse from 'html-react-parser';

export default function PreOrderPurchased() {
    const eventPreset = useSelector((state) => state.competition);
    const { t } = useTranslations();

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
                <h2 className="mt-md">{parse(t('PURCHASE_TITLE'))}</h2>
                <p>{t("PREORDER_EMAIL")}</p>
            </div>
        </>
    );
}
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../features/TranslationProvider";
import { Button } from "../shared/components/ui";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function PayAtCounter() {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const eventSlug = useSelector((state) => state.competition.slug);

  //pagina timeout
  useEffect(() => {
    const timeOut = setInterval(() => {
      //errorToast("Si è verificato un errore");
      navigate("/event/" + eventSlug, { replace: true });
    }, 6000000);

    // cleanup function
    return () => clearInterval(timeOut);
  }, []);

  return (
    <div className="text-center mt-10 items-center flex flex-col gap-4">
      <h1>Grazie! </h1>
      <p>Ora non ti resta che recarti alla cassa per completare il pagamento</p>
      <Button onClick={() => navigate(`/event/${eventSlug}`)}>
        {t("NEW_SEARCH")}
      </Button>
    </div>
  );
}

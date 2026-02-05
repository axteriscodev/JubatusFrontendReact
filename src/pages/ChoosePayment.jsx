import { useTranslations } from "../features/TranslationProvider";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

export default function ChoosePayment() {
  const navigate = useNavigate();
  const { t } = useTranslations();

  return (
    <div className="form-sm">
      <button
        className="my-button w-100 mt-sm"
        onClick={() => {
          navigate("/checkout");
        }}
      >
        {parse(t("SELFIE_NEXT"))}
      </button>

      <button className="my-button w-100 mt-sm" onClick={() => {}}>
        {parse(t("SELFIE_NEXT"))}
      </button>
    </div>
  );
}

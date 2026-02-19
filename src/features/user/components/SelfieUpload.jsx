import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { heicTo, isHeic } from "heic-to";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";

import styles from "./SelfieUpload.module.css";

export default function SelfieUpload({ onDataChange, onError = false }) {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bibNumber, setBibNumber] = useState("");
  const [processedFile, setProcessedFile] = useState(null);
  const { t } = useTranslations();
  const showBibNumber = useSelector((state) => state.competition?.bibNumber);

  const handleImageClick = () => {
    if (imageUrl || loading) return false;
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    let currentProcessedFile = file;

    try {
      if (await isHeic(file)) {
        // convertiamo HEIC in JPEG
        const convertedBlob = await heicTo({
          blob: file,
          type: "image/jpeg",
          quality: 0.9,
        });
        currentProcessedFile = new File(
          [convertedBlob],
          file.name.replace(/\.heic$/i, ".jpg"),
          { type: "image/jpeg" },
        );
      }

      setImageUrl(URL.createObjectURL(currentProcessedFile));
      setProcessedFile(currentProcessedFile);
      onDataChange({ image: currentProcessedFile, bibNumber: bibNumber });
      onError = false;
    } catch (err) {
      console.error("Errore nella conversione HEIC:", err);
      onError = true;
      setImageUrl(null);
      setProcessedFile(null);
      onDataChange({ image: null, bibNumber: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    const confirmDelete = window.confirm(t("SELFIE_REMOVE"));
    if (confirmDelete) {
      setImageUrl(null);
      setProcessedFile(null);
      fileInputRef.current.value = "";
      onDataChange({ image: null, bibNumber: bibNumber });
    }
  };

  const handleBibNumberChange = (event) => {
    const value = event.target.value;
    setBibNumber(value);
    onDataChange({ image: processedFile, bibNumber: value });
  };

  return (
    <div>
      <h3>{t("SELFIE_TITLE")}</h3>
      <p className="my-10 text-secondary">{t("SELFIE_UPLOAD")}</p>
      <div
        className={`${styles.avatar} ${!imageUrl && !loading ? styles.add : ""}`}
        onClick={handleImageClick}
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
      {imageUrl && !loading && (
        <div className="flex justify-center items-center">
          <img
            src="/images/trash-fill.svg"
            className={styles.trash}
            onClick={handleRemoveImage}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
      {onError && <p className="on-error">{t("SELFIE_INSERT")}</p>}
      {showBibNumber && (
        <div className="mb-8 text-left">
          <FormLabel htmlFor="bibNumber">{t("TARGA_TITLE")}</FormLabel>
          <Input
            id="bibNumber"
            type="text"
            placeholder={t("TARGA_PLACEHOLDER")}
            value={bibNumber}
            onChange={handleBibNumberChange}
          />
          <small className="text-muted">{t("TARGA_HELP")}</small>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

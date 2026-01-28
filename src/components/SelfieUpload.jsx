import { useRef, useState } from "react";
import { heicTo, isHeic } from "heic-to";
import { useTranslations } from "../features/TranslationProvider";

import styles from "./SelfieUpload.module.css";

export default function SelfieUpload({ onDataChange, onError = false }) {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslations();

  const handleImageClick = () => {
    if (imageUrl || loading) return false;
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    let processedFile = file;

    try {
      if (await isHeic(file)) {
        // convertiamo HEIC in JPEG
        const convertedBlob = await heicTo({
          blob: file,
          type: "image/jpeg",
          quality: 0.9,
        });
        processedFile = new File(
          [convertedBlob],
          file.name.replace(/\.heic$/i, ".jpg"),
          { type: "image/jpeg" },
        );
      }

      setImageUrl(URL.createObjectURL(processedFile));
      onDataChange(processedFile);
      onError = false;
    } catch (err) {
      console.error("Errore nella conversione HEIC:", err);
      onError = true;
      setImageUrl(null);
      onDataChange(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    const confirmDelete = window.confirm(t("SELFIE_REMOVE"));
    if (confirmDelete) {
      setImageUrl(null);
      fileInputRef.current.value = "";
      onDataChange(null);
    }
  };

  return (
    <div>
      <h3>{t("SELFIE_TITLE")}</h3>
      <p className="my-sm text-secondary">{t("SELFIE_UPLOAD")}</p>
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
        <div class="d-flex justify-content-center mb-1">
          <img
            src="/images/trash-fill.svg"
            className={styles.trash}
            onClick={handleRemoveImage}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
      {onError && <p className="on-error">{t("SELFIE_INSERT")}</p>}
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

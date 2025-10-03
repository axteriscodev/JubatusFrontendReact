import { useRef, useState } from "react";
import { useTranslations } from "../features/TranslationProvider";
import { useSelector } from "react-redux";

import styles from "./SelfieUpload.module.css";

export default function SelfieUpload({ onDataChange, onError = false }) {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const tagId = useSelector((state) => state.competition.tagId);
  const { t } = useTranslations();

  const handleImageClick = () => {
    if (imageUrl) return false;
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImageUrl(URL.createObjectURL(file));
      onDataChange(file);
      onError = false;
    }
  };

  return (
    <div>
      <h3>{t(`SELFIE_TITLE_${tagId}`)}</h3>
      <p className="my-sm text-secondary">{t(`SELFIE_UPLOAD_${tagId}`)}</p>
      <div
        className={`${styles.avatar} ${!imageUrl ? styles.add : ""}`}
        onClick={handleImageClick}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
      ></div>
      {imageUrl && (
        <img
          src="/images/trash-fill.svg"
          className={styles.trash}
          onClick={() => {
            const confirmDelete = window.confirm(t(`SELFIE_REMOVE_${tagId}`));
            if (confirmDelete) {
              setImageUrl(null);
              fileInputRef.current.value = ""; // reset del file input
              onDataChange(null); // notifica al parent che l'immagine è stata rimossa
            }
          }}
          style={{ cursor: "pointer" }}
        />
      )}
      {onError && <p className="on-error">{t(`SELFIE_INSERT_${tagId}`)}</p>}
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

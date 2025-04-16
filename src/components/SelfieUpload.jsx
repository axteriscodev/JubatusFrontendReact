import { useRef, useState } from "react";

import styles from "./SelfieUpload.module.css";

export default function SelfieUpload({ onDataChange, onError = false }) {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

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
      <h3>Carica il tuo selfie</h3>
      <p className="my-sm text-secondary">Carica il selfie e inserisci la tua e-mail per visualizzare i tuoi contenuti</p>    
      <div
        className={`${styles.avatar} ${!imageUrl ? styles.add : ""}`}
        onClick={handleImageClick}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover" } : {}}
      ></div>
      {imageUrl && (
        <img
          src="/images/trash-fill.svg"
          className={styles.trash}
          onClick={() => {
            const confirmDelete = window.confirm("Sei sicuro di voler rimuovere il selfie?");
            if (confirmDelete) {
              setImageUrl(null);
              fileInputRef.current.value = ""; // reset del file input
              onDataChange(null); // notifica al parent che l'immagine è stata rimossa
            }
          }}
          style={{ cursor: "pointer" }}
        />
      )}
      {onError && <p className="on-error">Inserisci un tuo selfie</p>}
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

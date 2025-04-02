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
    }
  };

  return (
    <div>
      <h3>
        Carica il tuo selfie
        <br />
        per vedere le tue foto
      </h3>

      <div
        className={`${styles.avatar} ${!imageUrl ? styles.add : ""}`}
        onClick={handleImageClick}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover" } : {}}
      ></div>
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

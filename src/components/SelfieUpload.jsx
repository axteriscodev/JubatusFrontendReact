import { useRef, useState } from "react";
import Stack from "react-bootstrap/Stack";

import styles from "./SelfieUpload.module.css";

export default function SelfieUpload({ onDataChange }) {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageClick = () => {
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
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover" }}
      ></div>
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

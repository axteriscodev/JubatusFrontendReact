import { useRef } from "react";
import Stack from "react-bootstrap/Stack";

import styles from "./SelfieUpload.module.css";

export default function SelfieUpload({ onDataChange }) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      onDataChange(file);
    }
  };

  return (
    <div>
      <h3>Carica il tuo selfie<br />per vedere le tue foto</h3>

      <div className={styles.avatar} onClick={handleImageClick}></div>
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

import { useState, useRef } from "react";

import styles from "./SelfieUpload.module.css";

export default function SelfieUpload({ onDataChange }) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if(file) {
        onDataChange(file);
    }

    // console.log(file);
  };

  return (
    <>
      <h3>Carica il tuo selfie</h3>

      <img className={styles.avatar} onClick={handleImageClick} />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
}

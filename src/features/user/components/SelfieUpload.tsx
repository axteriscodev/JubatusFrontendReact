import { useRef, useState, type ChangeEvent } from "react";
import { useAppSelector } from "@common/store/hooks";
import { heicTo, isHeic } from "heic-to";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";
import { Trash2 } from "lucide-react";

import styles from "./SelfieUpload.module.css";

interface SelfieData {
  image: File | null;
  bibNumber: string;
}

interface SelfieUploadProps {
  onDataChange: (data: SelfieData) => void;
  onError?: boolean;
}

export default function SelfieUpload({ onDataChange, onError = false }: SelfieUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bibNumber, setBibNumber] = useState("");
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const { t } = useTranslations();
  const showBibNumber = useAppSelector((state) => state.competition?.bibNumber);

  const handleImageClick = () => {
    if (imageUrl || loading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    let currentProcessedFile: File = file;

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
    } catch (err) {
      console.error("Errore nella conversione HEIC:", err);
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
      if (fileInputRef.current) fileInputRef.current.value = "";
      onDataChange({ image: null, bibNumber: bibNumber });
    }
  };

  const handleBibNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
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
          <button
            type="button"
            onClick={handleRemoveImage}
            className="bg-transparent border-0 p-0 cursor-pointer"
            aria-label="remove"
          >
            <Trash2 className={styles.trash} />
          </button>
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

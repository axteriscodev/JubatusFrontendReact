import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useAppSelector } from "@common/store/hooks";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";
import { Trash2 } from "lucide-react";
import { apiRequest } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";

import styles from "./SelfieUpload.module.css";

interface SelfieData {
  image: File | null;
  bibNumber: string;
}

interface SelfieUploadProps {
  onDataChange: (data: SelfieData) => void;
  onError?: boolean;
  description?: string;
}

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  tiff: "image/tiff",
  tif: "image/tiff",
};

function normalizeToMimeTypes(formats: string[]): string[] {
  return formats.map((f) =>
    f.includes("/")
      ? f.toLowerCase()
      : (EXT_TO_MIME[f.toLowerCase()] ?? `image/${f.toLowerCase()}`),
  );
}

export default function SelfieUpload({
  onDataChange,
  onError = false,
  description,
}: SelfieUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bibNumber, setBibNumber] = useState("");
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const [allowedMimeTypes, setAllowedMimeTypes] = useState<string[] | null>(null);
  const [formatError, setFormatError] = useState(false);
  const { t } = useTranslations();
  const showBibNumber = useAppSelector((state) => state.competition?.bibNumber);

  useEffect(() => {
    apiRequest({ api: API.SELFIE_FORMATS, method: "GET" })
      .then((res) => res.json())
      .then((data: unknown) => {
        const raw: string[] = Array.isArray(data)
          ? (data as string[])
          : (((data as { data?: { formats?: string[] } }).data?.formats) ?? []);
        setAllowedMimeTypes(normalizeToMimeTypes(raw));
      })
      .catch(() => {
        // fail open: se l'API non risponde non blocchiamo l'upload
      });
  }, []);

  const handleImageClick = () => {
    // Blocca il re-click se c'è già un'immagine o se la conversione è in corso
    if (imageUrl || loading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFormatError(false);
    let currentProcessedFile: File = file;

    try {
      const mightBeHeic =
        /\.heic$/i.test(file.name) ||
        file.type === "image/heic" ||
        file.type === "image/heif";

      if (mightBeHeic) {
        const { heicTo, isHeic } = await import("heic-to");
        if (await isHeic(file)) {
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
      }

      if (allowedMimeTypes && allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(currentProcessedFile.type.toLowerCase())) {
        setFormatError(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
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
      // Reset del valore per consentire di ri-selezionare lo stesso file
      if (fileInputRef.current) fileInputRef.current.value = "";
      onDataChange({ image: null, bibNumber: bibNumber });
    }
  };

  const handleBibNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBibNumber(value);
    // Passa processedFile (non null) per non perdere l'immagine già caricata
    onDataChange({ image: processedFile, bibNumber: value });
  };

  return (
    <div>
      <h3>{t("SELFIE_TITLE")}</h3>
      {description && (
        <div className="flex justify-center my-2">
          {/* La descrizione arriva come testo plain con a-capo: si converte in <br> per il render HTML */}
          <h4
            className="text-center"
            dangerouslySetInnerHTML={{
              __html: description.replace(/\r\n|\r|\n/g, "<br>"),
            }}
          />
        </div>
      )}
      <p className="my-1 sm:my-5 text-secondary">{t("SELFIE_UPLOAD")}</p>
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
      {formatError && <p className="on-error">{t("SELFIE_FORMAT_NOT_SUPPORTED")}</p>}
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

      {/* Input file nascosto: il click è delegato al div avatar sopra per UI personalizzata */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        title="caricamento selfie"
      />
    </div>
  );
}

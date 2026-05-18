import { Check, Play } from "lucide-react";
import { useTranslations } from "@common/i18n/TranslationProvider";
import styles from "./VideoPreorderCard.module.css";

interface VideoPreorderCardProps {
  isSelected: boolean;
  aspectRatio: string;
  onToggle: () => void;
}

export default function VideoPreorderCard({
  isSelected,
  aspectRatio,
  onToggle,
}: VideoPreorderCardProps) {
  const { t } = useTranslations();
  const ratioClass = `ratio-${aspectRatio.replace(":", "-")}`;

  return (
    <div>
      <div className={`ratio ${ratioClass}`}>
        <div
          className={`${styles.card} ${styles.clickable} ${isSelected ? styles.selected : ""}`}
          onClick={onToggle}
        >
          <div className={styles.placeholder}>
            <div className={styles.playButton}>
              <Play size={28} className="text-white ml-1" />
            </div>
          </div>

          <div className={styles.pendingBadge}>{t("REEL_PENDING")}</div>

          <div
            className={`${styles.circle} ${isSelected ? styles.circleSelected : ""}`}
          >
            {isSelected && <Check size={14} />}
          </div>
        </div>
      </div>
    </div>
  );
}

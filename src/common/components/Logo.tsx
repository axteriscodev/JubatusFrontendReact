import styles from "./Logo.module.css";

export interface LogoProps {
  src?: string;
  css?: string;
  size?: string;
}

/** Immagine logo dell'evento. size e css aggiungono classi Tailwind extra. */
export default function Logo({ src = "", css = "", size = "" }: LogoProps) {
  return (
    <>
      <img src={src} className={`${styles.logo} ${size} ${css}`} />
    </>
  );
}

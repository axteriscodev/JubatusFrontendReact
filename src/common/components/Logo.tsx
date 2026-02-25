import styles from "./Logo.module.css";

export interface LogoProps {
  src?: string;
  css?: string;
  size?: string;
}

export default function Logo({ src = "", css = "", size = "" }: LogoProps) {
  return (
    <>
      <img src={src} className={`${styles.logo} ${size} ${css}`} />
    </>
  );
}

import styles from "./Logo.module.css";

export default function Logo({src= "", css = "", size = ""}) {
    return (<>
    <img src={src} className={`${styles.logo} ${size} ${css}`}/>
    </>);
}
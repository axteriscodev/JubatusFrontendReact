import styles from "./Logo.module.css";

export default function Logo({css = "", size = ""}) {
    return (<>
    <img src="/images/oceanman_logo.jpeg" className={`${styles.logo} ${size} ${css}`}/>
    </>);
}
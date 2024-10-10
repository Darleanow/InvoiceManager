import Logo from "../components/atoms/Logo";
import SeparatorLine from "../components/atoms/SeparatorLine";
import styles from "./page.module.scss";

export default function SandBox() {
  return <div className={styles.main}>
    <Logo />
    <SeparatorLine />
  </div>;
}

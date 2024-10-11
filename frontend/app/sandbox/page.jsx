import styles from "./page.module.scss";

import Logo from "../components/atoms/Logo";
import SeparatorLine from "../components/atoms/SeparatorLine";
import DropdownButton from "../components/atoms/DropdownButton";
import DropdownContent from "../components/atoms/DropdownContent";

export default function SandBox() {
  return <div className={styles.main}>
    <Logo />
    <SeparatorLine />
    <DropdownButton children={"Username"}/>
    <DropdownContent />
  </div>;
}

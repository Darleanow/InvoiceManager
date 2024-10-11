import styles from "./DropdownButton.module.scss";
import { IoIosArrowDown } from "react-icons/io";

export default function DropdownButton({ children }) {
  return (
    <button className={styles.dropdown_button}>
      <span className={styles.button_text}>{children}</span>
      <span className={styles.button_icon}>
        <IoIosArrowDown />
      </span>
    </button>
  );
}

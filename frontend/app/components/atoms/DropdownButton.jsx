import styles from "./DropdownButton.module.scss";
import { IoIosArrowDown } from "react-icons/io";

export default function DropdownButton({ children, onClick, state }) {
  return (
    <button
      className={`${styles.dropdown_button} ${state ? styles.active : ""}`}
      onClick={onClick}
    >
      <span className={styles.button_text}>{children}</span>
      <span className={`${styles.button_icon} ${state ? styles.rotated : ""}`}>
        <IoIosArrowDown />
      </span>
    </button>
  );
}

"use client";

import { useState } from "react";
import DropdownButton from "../atoms/DropdownButton";
import DropdownContent from "../atoms/DropdownContent";
import styles from "./UserDropdown.module.scss";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.dropdown_wrapper}>
      <DropdownButton
        children={"Username"}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        state={isOpen}
      />
      {isOpen && (
        <div className={styles.dropdown_content_wrapper}>
          <DropdownContent />
        </div>
      )}
    </div>
  );
}

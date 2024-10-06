'use client';

import React from "react";
import styles from "./styles.module.css";

import {
  IoIosNotifications,
  IoIosSettings,
  IoIosSearch,
  IoIosArrowDown,
} from "react-icons/io";

export default function Topbar() {
  const handleSearchClick = (event) => {
    const input = event.currentTarget.querySelector("input");
    if (input) {
      input.focus(); 
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" || event.key === " ") {  
      handleSearchClick(event);
    }
  };
  return (
    <div className={styles.topbar_container}>
      <div className={styles.topbar_left_pannel}>
        <p className={styles.topbar_text} data-testid="logo_text">
          InMa
        </p>
        <div className={styles.topbar_vertical_line}></div>
        <p className={styles.topbar_user} data-testid="username_text">
          Username
        </p>
        <IoIosArrowDown className={styles.topbar_arrow} />
      </div>
      <div className={styles.topbar_middle_pannel}>
        <div className={styles.topbar_search_container} onClick={handleSearchClick} >
          <IoIosSearch className={styles.topbar_search_icon} />
          <input
            type="text"
            placeholder="Search"
            className={styles.topbar_search}
            data-testid="search_input"
          />
        </div>
      </div>
      <div className={styles.topbar_right_pannel}>
        <IoIosNotifications
          className={styles.topbar_notification}
          data-testid="notifications_icon"
        />
        <IoIosSettings
          className={styles.topbar_settings}
          data-testid="settings_icon"
        />
        <div className={styles.topbar_vertical_line}></div>
        <button
          className={styles.topbar_button}
          data-testid="create_invoice_button"
        >
          Create Invoice
        </button>
      </div>
    </div>
  );
}

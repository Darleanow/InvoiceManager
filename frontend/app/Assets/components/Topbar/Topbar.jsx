import React from "react";
import styles from "./styles.module.css";
import {
  IoIosNotifications,
  IoIosSettings,
  IoIosSearch,
  IoIosArrowDown,
} from "react-icons/io";

/**
 * Renders the Topbar component for displaying the top navigation bar.
 *
 * This component shows the company's logo, a search bar, user information,
 * and action icons like notifications and settings.
 *
 * @function Topbar
 * @returns {JSX.Element} The rendered Topbar component.
 */
export default function Topbar() {
  return (
    <div className={styles.topbar_container}>
      <div className={styles.topbar_left_pannel}>
        {/* Company/Logo Name */}
        <p className={styles.topbar_text} data-testid="logo_text">
          InMa
        </p>
        {/* Vertical Line Divider */}
        <div className={styles.topbar_vertical_line}></div>
        {/* Username Display */}
        <p className={styles.topbar_user} data-testid="username_text">
          Username
        </p>
        <IoIosArrowDown className={styles.topbar_arrow} />
      </div>
      <div className={styles.topbar_middle_pannel}>
        {/* Search Input */}
        <div className={styles.topbar_search_container}>
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
        {/* Notifications Icon */}
        <IoIosNotifications
          className={styles.topbar_notification}
          data-testid="notifications_icon"
        />
        {/* Settings Icon */}
        <IoIosSettings
          className={styles.topbar_settings}
          data-testid="settings_icon"
        />
        {/* Vertical Line Divider */}
        <div className={styles.topbar_vertical_line}></div>
        {/* Create Invoice Button */}
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

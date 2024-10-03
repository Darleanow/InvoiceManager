import React from "react";
import styles from "./styles.module.css";
import { IoIosNotifications, IoIosSettings, IoIosSearch, IoIosArrowDown } from "react-icons/io";

export default function Topbar() {
    return (
        <div className={styles.topbar_container}>
            <div className={styles.topbar_left_pannel}>
                <p className={styles.topbar_text}>InMa</p>
                <div className={styles.topbar_vertical_line}></div>
                <p className={styles.topbar_user}>Username</p>
                <IoIosArrowDown className={styles.topbar_arrow} />
            </div>
            <div className={styles.topbar_middle_pannel}>
                <div className={styles.topbar_search_container}>
                    <IoIosSearch className={styles.topbar_search_icon} />
                    <input type="text" placeholder="Search" className={styles.topbar_search} />
                </div>
            </div>
            <div className={styles.topbar_right_pannel}>
                <IoIosNotifications className={styles.topbar_notification} />
                <IoIosSettings className={styles.topbar_settings} />
                <div className={styles.topbar_vertical_line}></div>
                <button className={styles.topbar_button}>Create Invoice</button>
            </div>
        </div>
    );
}

import React from "react";
import styles from "./styles.module.css";

import { IoIosNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";


export default function Topbar() {
    
  
    return (
        <div classname={styles.topbar_container}>
            <div className={styles.topbar_left_pannel}>
                <p className={styles.topbar_text}>InMa</p>
                <p className={styles.topbar_user}>Username</p>
            </div>
            <div className={styles.topbar_middle_pannel}>
                <div className={styles.topbar_search_container}>
                    <IoIosSearch classname={styles.topbar_search_icon}/>
                    <input type="text" placeholder="Search" className={styles.topbar_search} />
                </div>
            </div>
            <div className={styles.topbar_right_pannel}>
                <IoIosNotifications className={styles.topbar_notification}/>
                <IoIosSettings className={styles.topbar_settings} />
                <button>Create Invoice</button>
            </div>
        </div>
    );
}
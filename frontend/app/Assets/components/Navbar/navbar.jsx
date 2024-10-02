import React from 'react';
import styles from './styles.module.css';
import { AiFillDollarCircle } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import { BiSolidReport } from "react-icons/bi";

export default function Navbar() {
    return (
        <div>
            <nav>
                <ul>
                    <li className={styles.navItem}>
                        <button className={styles.icon_dollar}>
                            <AiFillDollarCircle className={styles.icon}/>
                            <span className={styles.navtext}>Billing</span>
                        </button>
                    </li>
                    <li className={styles.navItem}>
                        <button className={styles.icon_people}>
                            <IoIosPeople className={styles.icon}/>
                            <span className={styles.navtext}>Clients</span>
                        </button>
                    </li>
                    <li className={styles.navItem}>
                        <button className={styles.icon_report}>
                            <BiSolidReport className={styles.icon}/>
                            <span className={styles.navtext}>Reporting</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

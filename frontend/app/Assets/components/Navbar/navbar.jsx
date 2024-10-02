import React from 'react';
import styles from './styles.module.css';
import { AiFillDollarCircle } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import { BiSolidReport } from "react-icons/bi";

export default function Navbar() {
    return (
        <div className={styles.navbarContainer}>
            <nav className={styles.navbar}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <button className={styles.navButton}>
                            <AiFillDollarCircle className={styles.icon}/>
                            <span className={styles.navText}>Billing</span>
                        </button>
                    </li>
                    <li className={styles.navItem}>
                        <button className={styles.navButton}>
                            <IoIosPeople className={styles.icon}/>
                            <span className={styles.navText}>Clients</span>
                        </button>
                    </li>
                    <li className={styles.navItem}>
                        <button className={styles.navButton}>
                            <BiSolidReport className={styles.icon}/>
                            <span className={styles.navText}>Reporting</span>
                        </button>
                    </li>
                </ul>
                <div className={styles.fullWidthLine}></div> 
            </nav>
        </div>
    );
}

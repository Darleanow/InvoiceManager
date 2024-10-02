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
                    <div classname={styles.icon_dollar}>
                        <AiFillDollarCircle classname={styles.icon}/>
                        <li classname={styles.navtext}>Billing</li>
                    </div>
                    <div classname={styles.icon_people}>
                        <IoIosPeople classname={styles.icon}/>
                        <li classname={styles.navtext}>Clients</li>
                    </div>
                    <div classname={styles.icon_report}>
                        <BiSolidReport classname={styles.icon}/>
                        <li classname={styles.navtext}>Reporting</li>
                    </div>
                </ul>
            </nav>
        </div>
    )
}

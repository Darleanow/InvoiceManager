"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";

import { AiFillDollarCircle } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import { BiSolidReport } from "react-icons/bi";

export default function Navbar() {
  const [active, setActive] = useState("billing");

  const handleSetActive = (navItem) => {
    setActive(navItem);
  };

  return (
    <div className={styles.navbar_container}>
      <nav className={styles.navbar}>
        <ul className={styles.nav_list}>
          <li className={styles.nav_item}>
            <button
              className={`${styles.nav_button} ${
                active === "billing" ? styles.active : ""
              }`} // Apply active class
              onClick={() => handleSetActive("billing")}
            >
              <AiFillDollarCircle className={styles.icon} />
              <span className={styles.nav_text}>Billing</span>
            </button>
          </li>
          <li className={styles.nav_item}>
            <button
              className={`${styles.nav_button} ${
                active === "clients" ? styles.active : ""
              }`} // Apply active class
              onClick={() => handleSetActive("clients")}
            >
              <IoIosPeople className={styles.icon} />
              <span className={styles.nav_text}>Clients</span>
            </button>
          </li>
          <li className={styles.nav_item}>
            <button
              className={`${styles.nav_button} ${
                active === "reporting" ? styles.active : ""
              }`} // Apply active class
              onClick={() => handleSetActive("reporting")}
            >
              <BiSolidReport className={styles.icon} />
              <span className={styles.nav_text}>Reporting</span>
            </button>
          </li>
        </ul>
        <div className={styles.line}></div>
      </nav>
    </div>
  );
}

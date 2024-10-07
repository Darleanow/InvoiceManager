"use client";

import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import { BiSolidReport } from "react-icons/bi";

/**
 * Renders the Navbar for navigation between different application sections.
 *
 * This component displays a navigation bar with tabs for different sections
 * (Billing, Clients, Reporting) and supports mouse and keyboard interaction.
 *
 * @function Navbar
 * @returns {JSX.Element} The rendered Navbar component.
 */
export default function Navbar() {
  const [active, setActive] = useState("billing");
  const billingRef = useRef(null);
  const clientsRef = useRef(null);
  const reportingRef = useRef(null);

  /**
   * Array of tab objects representing each navigation tab.
   *
   * @type {Array<{ id: string, label: string, icon: React.ElementType, ref: React.RefObject<HTMLButtonElement> }>}
   */
  const tabs = [
    {
      id: "billing",
      label: "Billing",
      icon: AiFillDollarCircle,
      ref: billingRef,
    },
    { id: "clients", label: "Clients", icon: IoIosPeople, ref: clientsRef },
    {
      id: "reporting",
      label: "Reporting",
      icon: BiSolidReport,
      ref: reportingRef,
    },
  ];

  /**
   * Handles keyboard navigation within the navbar.
   *
   * @param {KeyboardEvent} e - The keyboard event object.
   * @param {number} index - The index of the current tab being focused.
   */
  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      let newIndex;
      if (e.key === "ArrowRight") {
        newIndex = (index + 1) % tabs.length;
      } else {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      }
      tabs[newIndex].ref.current.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(tabs[index].id);
    }
  };

  return (
    <div className={styles.navbar_container} data-testid="navbar">
      <nav className={styles.navbar}>
        <ul className={styles.nav_list} role="tablist" data-testid="nav_list">
          {tabs.map((tab, index) => (
            <li key={tab.id} className={styles.nav_item}>
              <button
                data-testid={`${tab.id}_button`}
                data-active={active === tab.id ? "true" : "false"}
                className={`${styles.nav_button} ${
                  active === tab.id ? styles.active : ""
                }`}
                onClick={() => setActive(tab.id)}
                role="tab"
                aria-selected={active === tab.id ? "true" : "false"}
                tabIndex={active === tab.id ? "0" : "-1"}
                ref={tab.ref}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <tab.icon
                  className={styles.icon}
                  data-testid={`${tab.id}_icon`}
                />
                <span
                  className={styles.nav_text}
                  data-testid={`${tab.id}_text`}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.line}></div>
      </nav>
    </div>
  );
}

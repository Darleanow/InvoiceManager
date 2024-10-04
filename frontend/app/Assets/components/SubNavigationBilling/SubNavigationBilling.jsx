"use client";

import { useState } from "react";
import styles from "./SubNavigationBilling.module.css";

import { IoIosDownload } from "react-icons/io";

export default function SubNavigationBilling() {
  const [currentSubNav, setCurrentSubNav] = useState("overview");

  // Function to handle subnav change
  const handleSubNavChange = (subNav) => {
    setCurrentSubNav(subNav);
  };

  return (
    <>
      <h1 className={styles.billing_title}>Billing</h1>
      <div className={styles.billing_subnav}>
        <div className={styles.billing_subnav_items}>
          <button

            className={
              currentSubNav === "overview"
                ? `${styles.billing_subnav_item_active}`
                : ""
            }
            onClick={() => handleSubNavChange("overview")}
          >
            Overview
          </button>
          <button
            className={
              currentSubNav === "quotation"
                ? `${styles.billing_subnav_item_active}`
                : ""
            }
            onClick={() => handleSubNavChange("quotation")}
          >
            Quotation
          </button>
          <button
            className={
              currentSubNav === "invoice"
                ? `${styles.billing_subnav_item_active}`
                : ""
            }
            onClick={() => handleSubNavChange("invoice")}
          >
            Invoice
          </button>
        </div>
        <hr className={styles.separator_line} />
        {/* TODO: Add filters here */}
        <div className={styles.filter_options}>
          <div className={styles.date_picker_place_holder_left} />
          <div className={styles.date_picker_place_holder_right} />
          <p className={styles.compared_to_text}>compared to</p>
          <div className={styles.compared_to_dropdown_period}></div>
          <button
            className={styles.export_button}
            onClick={() => {
              alert("T'exporte rien");
            }}
          >
            <IoIosDownload className={styles.export_icon} />
            Export
          </button>
        </div>
      </div>
      <div className={styles.billing_subnav_content}>
        <div className={styles.billing_monthly_revenue}></div>
        <div className={styles.outstanding_invoices}></div>
        <div className={styles.empty_content}></div>
        <div className={styles.empty_content}></div>
      </div>
    </>
  );
}

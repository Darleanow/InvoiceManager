"use client";

import { useState } from "react";

import styles from "./Navbar.module.css";
import BrokenHomeIcon from "../Icons/Home";
import BrokenInvoiceAddIcon from "../Icons/InvoiceAdd";
import BrokenClientsIcon from "../Icons/Clients";
import BrokenBillListIcon from "../Icons/BillList";
import BrokenParametersIcon from "../Icons/Parameters";

export default function Navbar() {
  const [currentActive, setCurrentActive] = useState("Home");

  return (
    <div className={styles.navbar_container}>
      <a
        href="/"
        className={styles.nav_link}
        onClick={() => setCurrentActive("Home")}
      >
        <BrokenHomeIcon
          size={24}
          color={currentActive === "Home" ? "#E29C23" : "#FFF"}
          hover_color="#E29C23"
        />
      </a>

      <a
        href="/Invoices"
        className={styles.nav_link}
        onClick={() => setCurrentActive("InvoiceAdd")}
      >
        <BrokenInvoiceAddIcon
          size={24}
          color={currentActive === "InvoiceAdd" ? "#E29C23" : "#FFF"}
          hover_color="#E29C23"
        />
      </a>

      <a
        href="/Clients"
        className={styles.nav_link}
        onClick={() => setCurrentActive("Clients")}
      >
        <BrokenClientsIcon
          size={24}
          color={currentActive === "Clients" ? "#E29C23" : "#FFF"}
          hover_color="#E29C23"
        />
      </a>

      <a
        href="/InvoicesList"
        className={styles.nav_link}
        onClick={() => setCurrentActive("BillList")}
      >
        <BrokenBillListIcon
          size={24}
          color={currentActive === "BillList" ? "#E29C23" : "#FFF"}
          hover_color="#E29C23"
        />
      </a>

      <a
        href="/Parameters"
        className={styles.nav_link}
        onClick={() => setCurrentActive("Parameters")}
      >
        <BrokenParametersIcon
          size={24}
          color={currentActive === "Parameters" ? "#E29C23" : "#FFF"}
          hover_color="#E29C23"
        />
      </a>
    </div>
  );
}

import React from "react";
import styles from "./ContactInformation.module.scss";

const ContactInformation = () => {
    return <input type="text" placeholder="Contact Information" className={styles.contactinfo_input} />;
};

export default ContactInformation;
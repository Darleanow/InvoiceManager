import styles from './settingsInvoice.module.scss';
import React from 'react';
import InvoiceNumbering from './InvoiceDefaults/InvoiceNumbering/InvoiceNumbering';
import InvoicePrefixSuffix from './InvoiceDefaults/InvoicePrefixSufix/InvoicePrefixSuffix';



export default function SettingsInvoice() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        SettingsInvoice
        </h1>
        <div className={styles.invoice_default_container}>
          <div className={styles.InvoiceNumbering_container}>
            <InvoiceNumbering />
          </div>
          <div className={styles.InvoicePrefixSuffix_container}>
            <InvoicePrefixSuffix />
          </div>
        </div>  
    </div>
  );
}

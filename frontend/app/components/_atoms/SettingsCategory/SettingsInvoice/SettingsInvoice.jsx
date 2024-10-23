import styles from './SettingsInvoice.module.scss';
import React from 'react';
import InvoiceNumbering from './InvoiceDefaults/InvoiceNumbering/InvoiceNumbering';
import InvoicePrefixSuffix from './InvoiceDefaults/InvoicePrefixSufix/InvoicePrefixSuffix';
import InvoiceLogoToggle from './InvoiceAppearance/AddLogoToInvoice/AddLogoToInvoice';



export default function SettingsInvoice() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        SettingsInvoice
        </h1>
          <div className={styles.invoice_default_container}>
            <h3>Invoice Defaults</h3>
            <div className={styles.InvoiceNumbering_container}>
              <InvoiceNumbering />
            </div>
            <div className={styles.InvoicePrefixSuffix_container}>
              <InvoicePrefixSuffix />
            </div>
            <div className={styles.InvoiceAppearance_container}>
              <h3>Invoice Appearance</h3>
              <div className={styles.invoiceLogoToggleContainer}>
                <InvoiceLogoToggle />
              </div>
            </div>
            <div className={styles.InvoiceReminder_container}>
              <h3>Invoice Reminder</h3>
            </div>
            <div className={styles.DefaultItemsAndServices_container}>
              <h3>Default Items and Services</h3>
            </div>
        </div>  
    </div>
  );
}

import React, { useState } from 'react';

import CreateInvoiceBar from '../../_organisms/CreateInvoiceBar/CreateInvoiceBar';
import styles from './CreateInvoice.module.scss';
import HorizontalSeparatorLine from '../../_atoms/HoriontalSeparatorLine/HorizontalSeparatorLine';
import FormInput from '../../_atoms/FormInput/FormInput';
import ClientFormInput from '../../_molecules/ClientFormInput/ClientFormInput';
import DateFormSelector from '../../_molecules/DateFormSelector/DateFormSelector';

export default function CreateInvoice() {
  const [dueDate, setDueDate] = useState('');

  const handleDateChange = (newDate) => {
    setDueDate(newDate);
    console.log('Selected due date:', newDate);
  };

  return (
    <div className={styles.page_container}>
      <CreateInvoiceBar />
      <div className={styles.main_content}>
        <div className={styles.left_panel}>
          <h3>Create Invoice</h3>
          <p>Client</p>
          <ClientFormInput />
          <p>Subject</p>
          <FormInput placeholder="Invoice Subject" />
          <p>Due date</p>
          <DateFormSelector onDateChange={handleDateChange} />
          <p>Currency</p>
          <FormInput placeholder="Select currency" />
          <HorizontalSeparatorLine />
          <h3>Product</h3>
          <p>Item</p>
          <FormInput placeholder="Find item" />
          <HorizontalSeparatorLine />
          <h3>Additional Options</h3>
          <p>Terms & Conditions</p>
          <p>Attachement</p>
          <p>Customer Notes</p>
          <p>Footer</p>
          <div className={styles.footer}>
            <p>Last saved: today 4:20pm</p>
            <div className={styles.buttons}>
              <button className={styles.cancel_button}>Cancel</button>
              <button className={styles.download_button}>Download</button>
            </div>
          </div>
        </div>
        <div className={styles.right_panel}></div>
      </div>
    </div>
  );
}

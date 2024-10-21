'use client';

import React, { useState } from 'react';

import CreateInvoiceBar from '../../_organisms/CreateInvoiceBar/CreateInvoiceBar';
import styles from './CreateInvoice.module.scss';
import HorizontalSeparatorLine from '../../_atoms/HoriontalSeparatorLine/HorizontalSeparatorLine';
import FormInput from '../../_atoms/FormInput/FormInput';
import ClientFormInput from '../../_molecules/ClientFormInput/ClientFormInput';
import DateFormSelector from '../../_molecules/DateFormSelector/DateFormSelector';
import CurrencySelector from '../../_molecules/CurrencySelector/CurrencySelector';
import ProductSearchDropdown from '../../_molecules/ProductSearchDropdown/ProductSearchDropdown';

export default function CreateInvoice() {
  const [dueDate, setDueDate] = useState('');

  const products = [
    {
      icon: 'https://via.placeholder.com/40',
      category: 'Category',
      price: 100,
      currency: 'USD',
      currencySymbol: '$',
      name: 'Product Name',
    },
    {
      icon: 'https://via.placeholder.com/40',
      category: 'Category2',
      price: 100,
      currency: 'USD',
      currencySymbol: '$',
      name: 'Product Name2',
    },
    {
      icon: 'https://via.placeholder.com/40',
      category: 'Category',
      price: 100,
      currency: 'USD',
      currencySymbol: '$',
      name: 'Product Name',
    },
  ];

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
          <div className={styles.form}>
            <p>Client</p>
            <ClientFormInput />
            <p>Subject</p>
            <FormInput placeholder="Invoice Subject" />
            <p>Due date</p>
            <DateFormSelector onDateChange={handleDateChange} />
            <p>Currency</p>
            <CurrencySelector />
            <HorizontalSeparatorLine width="calc(100% + 18px)" />
            <h3>Product</h3>
            <p>Item</p>
            <ProductSearchDropdown products={products} />
            <HorizontalSeparatorLine width="calc(100% + 18px)" />
            {/* <h3>Additional Options</h3>
            <p>Terms & Conditions</p>
            <p>Attachement</p>
            <p>Customer Notes</p>
            <p>Footer</p> */}
          </div>
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

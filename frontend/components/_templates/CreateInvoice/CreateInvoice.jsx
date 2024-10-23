'use client';

import React, { useState, useEffect, useRef } from 'react';
import CreateInvoiceBar from '../../_organisms/CreateInvoiceBar/CreateInvoiceBar';
import styles from './CreateInvoice.module.scss';
import HorizontalSeparatorLine from '../../_atoms/HoriontalSeparatorLine/HorizontalSeparatorLine';
import FormInput from '../../_atoms/FormInput/FormInput';
import ClientFormInput from '../../_molecules/ClientFormInput/ClientFormInput';
import DateFormSelector from '../../_molecules/DateFormSelector/DateFormSelector';
import CurrencySelector from '../../_molecules/CurrencySelector/CurrencySelector';
import ProductSearchDropdown from '../../_molecules/ProductSearchDropdown/ProductSearchDropdown';
import InvoiceTemplate from '../Invoices/InvoiceTemplate';

export default function CreateInvoice() {
  const [isVisible, setIsVisible] = useState(false);
  const [client, setClient] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subject, setSubject] = useState('');
  const [currency, setCurrency] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

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
  };

  return (
    <div className={styles.page_container}>
      <CreateInvoiceBar />
      <div
        className={`${styles.main_content} ${isVisible ? styles.appear : ''}`}
      >
        <div className={styles.left_panel}>
          <h3 className={styles.create_invoice_title}>Create Invoice</h3>
          <div className={styles.form}>
            <p>Client</p>
            <ClientFormInput value={client} onChange={setClient} />
            <p>Subject</p>
            <FormInput
              placeholder="Invoice Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <p>Due date</p>
            <DateFormSelector onDateChange={handleDateChange} />
            <p>Currency</p>
            <CurrencySelector value={currency} onChange={setCurrency} />
            <HorizontalSeparatorLine width="calc(100% + 18px)" />
            <h3>Product</h3>
            <p>Item</p>
            <ProductSearchDropdown
              products={products}
              selectedProducts={selectedProducts}
              onSelect={setSelectedProducts}
            />
            <HorizontalSeparatorLine width="calc(100% + 18px)" />
          </div>
          <div className={styles.footer}>
            <p>Last saved: today 4:20pm</p>
            <div className={styles.buttons}>
              <button className={styles.cancel_button}>Cancel</button>

              <button
                className={styles.download_button}
                onClick={() => handleDownload('docx')}
              >
                Download
              </button>
            </div>
          </div>
        </div>
        <div className={styles.right_panel}>
          <InvoiceTemplate
            formData={{
              client,
              subject,
              dueDate,
              currency,
              selectedProducts,
            }}
          />
        </div>
      </div>
    </div>
  );
}

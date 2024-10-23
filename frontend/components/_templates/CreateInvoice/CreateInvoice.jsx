'use client';

import React, { useState, useEffect } from 'react';
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
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const [isVisible, setIsVisible] = useState(false);
  const [client, setClient] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subject, setSubject] = useState('');
  const [currency, setCurrency] = useState({
    code: 'USD',
    symbol: '$',
    name: 'United States Dollar',
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const defaultProducts = [
    {
      name: 'Service Charge',
      price: 100,
      quantity: 1,
      category: 'Service',
    },
    {
      name: 'Additional Service',
      price: 150,
      quantity: 2,
      category: 'Service',
    },
  ];

  const mockSelectedProducts = [
    {
      name: 'Service Charge',
      price: 100,
      quantity: 1,
      category: 'Service',
    },
  ];

  const handleDateChange = (newDate) => {
    setDueDate(newDate);
  };

  const displayData = {
    client: {
      name: client?.name || null,
      email: client?.email || null,
      address: client?.address || null,
    },
    subject: subject || null,
    dueDate: dueDate || null,
    currency: currency || null,
    products: selectedProducts.length ? selectedProducts : null,
  };

  const handleDownload = async (format) => {
    const templateContent =
      document.getElementById('invoice-template').innerHTML;

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: templateContent,
          format: format,
          data: displayData,
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating document:', error);
    }
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
              products={defaultProducts}
              selectedProducts={selectedProducts}
              onSelect={setSelectedProducts}
              currencySymbol={currency.symbol}
            />
            <HorizontalSeparatorLine width="calc(100% + 18px)" />
          </div>
          <div className={styles.footer}>
            <p>Last saved: today 4:20pm</p>
            <div className={styles.buttons}>
              <button className={styles.cancel_button}>Cancel</button>
              <button
                className={styles.download_button}
                onClick={() => handleDownload(selectedFormat)}
              >
                Download
              </button>
            </div>
          </div>
        </div>
        <div className={styles.right_panel}>
          <InvoiceTemplate
            displayData={displayData}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
          />
        </div>
      </div>
    </div>
  );
}

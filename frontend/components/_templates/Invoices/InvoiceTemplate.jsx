// InvoiceTemplate.tsx
import React, { useState } from 'react';
import styles from './InvoiceTemplate.module.scss';

const InvoiceTemplate = ({ formData, templateType = 'modern' }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const placeholderData = {
    client: 'Client Name',
    subject: 'Invoice Subject',
    dueDate: 'Due Date',
    currency: 'USD',
    products: [
      {
        name: 'Product Name',
        quantity: 1,
        price: 100,
        total: 100,
      },
    ],
  };

  const displayData = {
    client: formData.client || placeholderData.client,
    subject: formData.subject || placeholderData.subject,
    dueDate: formData.dueDate || placeholderData.dueDate,
    currency: formData.currency || placeholderData.currency,
    products: formData.selectedProducts?.length
      ? formData.selectedProducts
      : placeholderData.products,
  };

  const subtotal = displayData.products.reduce(
    (acc, product) => acc + product.price * (product.quantity || 1),
    0
  );
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

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
    <div className={styles.container}>
      <div className={styles.preview_container}>
        <div className={styles.preview_header}>
          <h3 className={styles.preview_title}>Preview</h3>
          <div className={styles.button_group}>
            <button
              className={`${styles.format_button} ${selectedFormat === 'pdf' ? styles.active : ''}`}
              onClick={() => setSelectedFormat('pdf')}
            >
              <span className={styles.icon}>📄</span>
              PDF
            </button>
            <button
              className={`${styles.format_button} ${selectedFormat === 'docx' ? styles.active : ''}`}
              onClick={() => setSelectedFormat('docx')}
            >
              <span className={styles.icon}>📝</span>
              DOCX
            </button>
            <button
              className={styles.download_button}
              onClick={() => handleDownload(selectedFormat)}
            >
              <span className={styles.icon}>⬇️</span>
              Download
            </button>
          </div>
        </div>

        <div id="invoice-template" className={styles.invoice_template}>
          <div className={styles.invoice_header}>
            <div className={styles.invoice_title}>
              <h2>INVOICE</h2>
              <p>#{Math.random().toString(36).substr(2, 9)}</p>
            </div>
            <div className={styles.due_date}>
              <p className={styles.label}>Due Date:</p>
              <p>{displayData.dueDate}</p>
            </div>
          </div>

          <div className={styles.bill_to}>
            <h3>Bill To:</h3>
            <p>{displayData.client}</p>
          </div>

          <div className={styles.subject}>
            <h3>Subject:</h3>
            <p>{displayData.subject}</p>
          </div>

          <table className={styles.items_table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {displayData.products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.quantity || 1}</td>
                  <td>
                    {displayData.currency} {product.price.toFixed(2)}
                  </td>
                  <td>
                    {displayData.currency}{' '}
                    {(product.price * (product.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.totals}>
            <div className={styles.totals_content}>
              <div className={styles.totals_row}>
                <span>Subtotal:</span>
                <span>
                  {displayData.currency} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className={styles.totals_row}>
                <span>Tax (20%):</span>
                <span>
                  {displayData.currency} {tax.toFixed(2)}
                </span>
              </div>
              <div className={`${styles.totals_row} ${styles.total}`}>
                <span>Total:</span>
                <span>
                  {displayData.currency} {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;

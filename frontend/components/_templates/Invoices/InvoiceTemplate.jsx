import React, { useState } from 'react';
import styles from './InvoiceTemplate.module.scss';
import '../../../styles/_templates/InvoiceStyles.scss';
import {
  BsFileEarmarkPdf,
  BsFileEarmarkWord,
  BsFileEarmarkText,
} from 'react-icons/bs';
import HorizontalSeparatorLine from '@/components/_atoms/HoriontalSeparatorLine/HorizontalSeparatorLine';

const InvoiceTemplate = ({ displayData }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const subtotal = displayData.products.reduce(
    (acc, product) => acc + product.price * (product.quantity || 1),
    0
  );
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  return (
    <div className={styles.container}>
      <div className={styles.preview_container}>
        <div className={styles.topbar_header}>
          <div className={styles.preview_header}>
            <h3 className={styles.preview_title}>Preview</h3>
            <div className={styles.button_group}>
              <button
                className={`${styles.format_button} ${selectedFormat === 'pdf' ? styles.active : ''}`}
                onClick={() => setSelectedFormat('pdf')}
              >
                <BsFileEarmarkPdf className={styles.icon} />
                PDF
              </button>
              <button
                className={`${styles.format_button} ${selectedFormat === 'docx' ? styles.active : ''}`}
                onClick={() => setSelectedFormat('docx')}
              >
                <BsFileEarmarkWord className={styles.icon} />
                Docx
              </button>
              <button
                className={`${styles.format_button} ${selectedFormat === 'text' ? styles.active : ''}`}
                disabled
              >
                <BsFileEarmarkText className={styles.icon} />
                Text
              </button>
            </div>
          </div>
          <HorizontalSeparatorLine color="#6E6E6E" />
        </div>
        <div id="invoice-template" className="invoice_template">
          <div className="invoice_header">
            <div className="invoice_title">
              <h2>INV2398-08-087</h2>
            </div>
            <hr className="separator_line" />
          </div>
          <div className="invoice_details">
            <div className="invoice_line">
              <div className="info_line">
                <h3>Subject</h3>
                <p>{displayData.subject}</p>
              </div>
              <div className="info_line">
                <h3>Billed To</h3>
                <p>{displayData.client.email}</p>
                <p>{displayData.client.address}</p>
              </div>
            </div>
            <div className="invoice_line">
              <div className="info_line">
                <h3>Due date</h3>
                <p>{displayData.dueDate}</p>
              </div>

              <div className="info_line">
                <h3>Currency</h3>
                <p>{displayData.currency.name}</p>
              </div>
            </div>
          </div>

          <table className="items_table">
            <thead>
              <tr>
                <th className="description_column column">DESCRIPTION</th>
                <th className="qty_column column">QTY</th>
                <th className="unit_price_column column">UNIT PRICE</th>
                <th className="total_column column">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {displayData.products.map((product, index) => (
                <tr key={index}>
                  <td className="description_column">{product.name}</td>
                  <td className="qty_column">{product.quantity || 1}</td>
                  <td className="unit_price_column">
                    {displayData.currency.symbol}
                    {parseInt(product.price).toFixed(2)}
                  </td>
                  <td className="total_column">
                    {displayData.currency.symbol}
                    {(product.price * (product.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals">
            <div className="totals_content">
              <div className="totals_row">
                <span className="subtotal_text">Subtotal:</span>
                <span>Tax (20%):</span>
                <span>Total:</span>
              </div>
              <div className="totals_row_values">
                <span>
                  {displayData.currency.symbol} {subtotal.toFixed(2)}
                </span>
                <span>
                  {displayData.currency.symbol} {tax.toFixed(2)}
                </span>
                <span>
                  {displayData.currency.symbol} {total.toFixed(2)}
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

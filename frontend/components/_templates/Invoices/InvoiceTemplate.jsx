import React, { useState } from 'react';
import styles from './InvoiceTemplate.module.scss';
import '../../../styles/_templates/InvoiceStyles.scss';
import PropTypes from 'prop-types';
import {
  BsFileEarmarkPdf,
  BsFileEarmarkWord,
  BsFileEarmarkText,
} from 'react-icons/bs';
import HorizontalSeparatorLine from '@/components/_atoms/HoriontalSeparatorLine/HorizontalSeparatorLine';

const Placeholder = ({ size = 'small' }) => {
  return <span className={`${styles.placeholder} ${styles[size]}`}></span>;
};

Placeholder.propTypes = {
  size: PropTypes.string,
};

const InvoiceTemplate = ({
  displayData,
  selectedFormat,
  setSelectedFormat,
}) => {
  const products = displayData?.products || [];
  const subtotal = products.length
    ? products.reduce(
        (acc, product) => acc + (product.price || 0) * (product.quantity || 1),
        0
      )
    : null;
  const tax = subtotal ? subtotal * 0.2 : null;
  const total = subtotal ? subtotal + tax : null;

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
                className={`${styles.format_button} ${styles.disabled} ${selectedFormat === 'text' ? styles.active : ''}`}
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
                <p>
                  {displayData.subject?.trim() ? (
                    displayData.subject.trim()
                  ) : (
                    <Placeholder />
                  )}
                </p>
              </div>
              <div className="info_line">
                <h3>Billed To</h3>
                <p>
                  {displayData.client.name ? (
                    displayData.client.name
                  ) : (
                    <Placeholder />
                  )}
                </p>
                <p>
                  {displayData.client.email ? (
                    displayData.client.email
                  ) : (
                    <Placeholder />
                  )}
                </p>
                <p>
                  {displayData.client.address ? (
                    displayData.client.address
                  ) : (
                    <Placeholder size="large" />
                  )}
                </p>
              </div>
            </div>
            <div className="invoice_line">
              <div className="info_line">
                <h3>Due date</h3>
                <p>
                  {displayData.dueDate ? displayData.dueDate : <Placeholder />}
                </p>
              </div>

              <div className="info_line">
                <h3>Currency</h3>
                <p>
                  {displayData.currency.name ? (
                    displayData.currency.name
                  ) : (
                    <Placeholder size="large" />
                  )}
                </p>
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
              {displayData.products && displayData.products.length > 0 ? (
                displayData.products.map((product, index) => (
                  <tr key={index}>
                    <td className="description_column">
                      {product.name ? (
                        product.name
                      ) : (
                        <Placeholder size="small" />
                      )}
                    </td>
                    <td className="qty_column">
                      {product.quantity !== undefined &&
                      product.quantity !== null ? (
                        product.quantity
                      ) : (
                        <Placeholder size="integer" />
                      )}
                    </td>
                    <td className="unit_price_column">
                      {displayData.currency?.symbol}
                      {product.price !== undefined && product.price !== null ? (
                        parseFloat(product.price).toFixed(2)
                      ) : (
                        <Placeholder size="integer" />
                      )}
                    </td>
                    <td className="total_column">
                      {displayData.currency?.symbol}
                      {product.price !== undefined &&
                      product.quantity !== undefined ? (
                        (product.price * (product.quantity || 1)).toFixed(2)
                      ) : (
                        <Placeholder size="integer" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="description_column">
                    <Placeholder size="small" />
                  </td>
                  <td className="qty_column">
                    <Placeholder size="integer" />
                  </td>
                  <td className="unit_price_column">
                    <Placeholder size="integer" />
                  </td>
                  <td className="total_column">
                    <Placeholder size="integer" />
                  </td>
                </tr>
              )}
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
                  {subtotal ? (
                    `${displayData.currency.symbol} ${subtotal.toFixed(2)}`
                  ) : (
                    <Placeholder size="integer" />
                  )}
                </span>
                <span>
                  {tax != null ? (
                    `${displayData.currency.symbol} ${tax.toFixed(2)}`
                  ) : (
                    <Placeholder size="integer" />
                  )}
                </span>
                <span>
                  {total ? (
                    `${displayData.currency.symbol} ${total.toFixed(2)}`
                  ) : (
                    <Placeholder size="integer" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InvoiceTemplate.propTypes = {
  displayData: PropTypes.shape({
    client: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      address: PropTypes.string,
    }),
    subject: PropTypes.string,
    dueDate: PropTypes.string,
    currency: PropTypes.shape({
      code: PropTypes.string,
      symbol: PropTypes.string,
      name: PropTypes.string,
    }),
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
      })
    ),
  }),
  selectedFormat: PropTypes.string,
  setSelectedFormat: PropTypes.func,
};

export default InvoiceTemplate;

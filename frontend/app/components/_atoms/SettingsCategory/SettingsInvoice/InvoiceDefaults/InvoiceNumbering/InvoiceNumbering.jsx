import { useState } from 'react';
import styles from './InvoiceNumbering.module.scss'; 

const InvoiceNumbering = () => {
  const [isAuto, setIsAuto] = useState(true); 
  const [manualInvoiceNumber, setManualInvoiceNumber] = useState('');

  const handleCheckboxChange = () => {
    setIsAuto(!isAuto);
    if (isAuto) {
      setManualInvoiceNumber(''); 
    }
  };

  const handleManualInputChange = (e) => {
    setManualInvoiceNumber(e.target.value);
  };

  return (
    <div className={styles.invoiceNumberingContainer}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={isAuto}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
        Auto-generate invoice numbers
      </label>

      {!isAuto && (
        <input
          type="text"
          value={manualInvoiceNumber}
          onChange={handleManualInputChange}
          placeholder="Enter invoice number"
          className={styles.manualInput}
        />
      )}
    </div>
  );
};

export default InvoiceNumbering;
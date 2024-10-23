import { useState } from 'react';
import styles from './AddLogoToInvoice.module.scss'; 

const InvoiceLogoToggle = () => {
  const [showLogo, setShowLogo] = useState(true); 

  const handleCheckboxChange = () => {
    setShowLogo(!showLogo);
  };

  return (
    <div className={styles.invoiceLogoToggleContainer}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={showLogo}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
        Display logo on invoice
      </label>

      {showLogo && (
        <div className={styles.logoPreview}>
          {/* Remplace ce bloc par ton vrai logo */}
          <img
            src="/path/to/your/logo.png"
            alt="Invoice Logo"
            className={styles.logoImage}
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceLogoToggle;
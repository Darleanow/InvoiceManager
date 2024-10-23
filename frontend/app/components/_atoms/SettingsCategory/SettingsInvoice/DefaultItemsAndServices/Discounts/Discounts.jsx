import { useState } from 'react';
import styles from './Discounts.module.scss';

const InvoiceDiscountToggle = () => {
  const [enableDiscount, setEnableDiscount] = useState(false); // Par défaut, les remises sont désactivées

  const handleCheckboxChange = () => {
    setEnableDiscount(!enableDiscount);
  };

  return (
    <div className={styles.invoiceDiscountToggleContainer}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={enableDiscount}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
        Enable default discounts (e.g. 10% early payment discount)
      </label>

      {enableDiscount && (
        <div className={styles.discountDetails}>
          <p className={styles.discountText}>
            10% early payment discount is applied.
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoiceDiscountToggle;
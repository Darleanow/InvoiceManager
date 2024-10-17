import React, { useState } from 'react';
import styles from './currencySymbolPosition.module.css'; // Assure-toi que le fichier est bien importé

const CurrencySymbolPosition = () => {
  const [selectedPosition, setSelectedPosition] = useState('before'); // Position par défaut

  const handleChange = (event) => {
    setSelectedPosition(event.target.value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <input
          type="radio"
          value="before"
          checked={selectedPosition === 'before'}
          onChange={handleChange}
          className={styles.radio}
        />
        Before (e.g., $100)
      </label>
      <label className={styles.label}>
        <input
          type="radio"
          value="after"
          checked={selectedPosition === 'after'}
          onChange={handleChange}
          className={styles.radio}
        />
        After (e.g., 100$)
      </label>
    </div>
  );
};

export default CurrencySymbolPosition;
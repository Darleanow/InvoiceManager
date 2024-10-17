import React, { useState } from 'react';
import styles from './DefaultCurrency.module.scss'; 

const DefaultCurrency = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); 

  const currencies = [
    'USD (United States Dollar)',
    'EUR (Euro)',
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button onClick={toggleDropdown} className={styles.dropdownToggle}>
        {selectedCurrency}
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {currencies.map((currency) => (
            <li 
              key={currency} 
              className={styles.dropdownItem} 
              onClick={() => selectCurrency(currency)}
            >
              {currency}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DefaultCurrency;
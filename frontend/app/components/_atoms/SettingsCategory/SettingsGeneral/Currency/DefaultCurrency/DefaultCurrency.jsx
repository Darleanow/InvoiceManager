import React, { useState } from 'react';
import styles from './DefaultCurrency.module.scss'; 
import { IoIosArrowDown } from "react-icons/io";

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
        <IoIosArrowDown className={`${styles.icon} ${isOpen ? styles.rotate : ''}`} />
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
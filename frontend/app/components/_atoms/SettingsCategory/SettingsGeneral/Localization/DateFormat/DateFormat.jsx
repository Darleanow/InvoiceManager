import React, { useState } from 'react';
import styles from './DateFormat.module.scss';

const DateFormat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('MM/DD/YYYY');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectFormat = (format) => {
    setSelectedFormat(format);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button 
        onClick={toggleDropdown} 
        className={styles.dropdownToggle}
      >
        {selectedFormat}
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          <li 
            className={styles.dropdownItem} 
            onClick={() => selectFormat('MM/DD/YYYY')}
          >
            MM/DD/YYYY
          </li>
          <li 
            className={styles.dropdownItem} 
            onClick={() => selectFormat('DD/MM/YYYY')}
          >
            DD/MM/YYYY
          </li>
          <li 
            className={styles.dropdownItem} 
            onClick={() => selectFormat('YYYY-MM-DD')}
          >
            YYYY-MM-DD
          </li>
        </ul>
      )}
    </div>
  );
};

export default DateFormat;
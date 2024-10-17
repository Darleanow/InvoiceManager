import React, { useState } from 'react';
import styles from './DateFormat.module.scss';
import { IoIosArrowDown } from "react-icons/io";

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
        <IoIosArrowDown className={`${styles.icon} ${isOpen ? styles.rotate : ''}`} />
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
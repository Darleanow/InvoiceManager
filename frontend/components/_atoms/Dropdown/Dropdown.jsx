import React, { useState } from 'react';
import styles from './Dropdown.module.scss';
import { FaChevronDown } from 'react-icons/fa';

export default function Dropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown_custom}>
      <div className={styles.dropdown_header} onClick={toggleDropdown}>
        {value}{' '}
        <span className={isOpen ? styles.arrow_up : styles.arrow_down}>
          <FaChevronDown className={styles.icon_arrow} />
        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdown_list}>
          {options.map((option) => (
            <div
              key={option}
              className={styles.dropdown_item}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

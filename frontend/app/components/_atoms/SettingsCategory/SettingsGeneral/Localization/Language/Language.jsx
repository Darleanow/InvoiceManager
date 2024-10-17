import React, { useState } from 'react';
import styles from './Language.module.scss';
import { IoIosArrowDown } from "react-icons/io";

const Language = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); 

  const languages = [
    'English',
    'French',
    'Spanish',
    'German',
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button onClick={toggleDropdown} className={styles.dropdownToggle}>
        {selectedLanguage}
        <IoIosArrowDown className={`${styles.icon} ${isOpen ? styles.rotate : ''}`} />
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {languages.map((language) => (
            <li 
              key={language} 
              className={styles.dropdownItem} 
              onClick={() => selectLanguage(language)}
            >
              {language}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Language;
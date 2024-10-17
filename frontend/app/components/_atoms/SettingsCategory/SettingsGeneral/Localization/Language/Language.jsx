import React, { useState } from 'react';
import styles from './language.module.css'; // Assure-toi que le fichier est bien importé

const Language = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Langue par défaut

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
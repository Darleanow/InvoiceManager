import React, { useState } from 'react';
import styles from './TimeZone.module.scss'; // Assure-toi que le fichier est bien importé

const TimeZone = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC'); // Fuseau horaire par défaut

  const timeZones = [
    'UTC',
    'GMT',
    'CET (Central European Time)',
    'EST (Eastern Standard Time)',
    'PST (Pacific Standard Time)',
    'IST (Indian Standard Time)',
    'AEST (Australian Eastern Standard Time)',
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectTimeZone = (timeZone) => {
    setSelectedTimeZone(timeZone);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button onClick={toggleDropdown} className={styles.dropdownToggle}>
        {selectedTimeZone}
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {timeZones.map((zone) => (
            <li 
              key={zone} 
              className={styles.dropdownItem} 
              onClick={() => selectTimeZone(zone)}
            >
              {zone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeZone;
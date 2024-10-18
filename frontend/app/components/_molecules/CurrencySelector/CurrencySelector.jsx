import { useState } from 'react';
import * as Flags from 'country-flag-icons/react/3x2'; // Import all flags
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './CurrencySelector.module.scss';

const currencies = [
  { code: 'USD', name: 'United States Dollar', countryCode: 'US' },
  { code: 'EUR', name: 'Euro', countryCode: 'EU' },
  { code: 'GBP', name: 'British Pound Sterling', countryCode: 'GB' },
  { code: 'JPY', name: 'Japanese Yen', countryCode: 'JP' },
  { code: 'AUD', name: 'Australian Dollar', countryCode: 'AU' },
  { code: 'CAD', name: 'Canadian Dollar', countryCode: 'CA' },
  { code: 'CHF', name: 'Swiss Franc', countryCode: 'CH' },
  { code: 'CNY', name: 'Chinese Yuan', countryCode: 'CN' },
  { code: 'INR', name: 'Indian Rupee', countryCode: 'IN' },
];

export default function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false); // Close the dropdown when a currency is selected
  };

  // Dynamically render the appropriate flag component based on the country code
  const renderFlag = (countryCode) => {
    const FlagComponent = Flags[countryCode]; // Get the flag component from the imported flags
    return FlagComponent ? <FlagComponent className={styles.flag} /> : null;
  };

  return (
    <div className={styles.currency_selector}>
      <button className={styles.selected_currency} onClick={toggleDropdown}>
        {renderFlag(selectedCurrency.countryCode)}
        <span className={styles.currency_code}>{selectedCurrency.code}</span>
        <span className={styles.currency_name}>({selectedCurrency.name})</span>
        <span className={styles.arrow_icon}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {isOpen && (
        <ul
          className={`${styles.currency_list} ${isOpen ? styles.show : styles.hide}`}
        >
          {currencies.map((currency) => (
            <button
              key={currency.code}
              className={styles.currency_item}
              onClick={() => handleCurrencyChange(currency)}
            >
              {renderFlag(currency.countryCode)}
              <span className={styles.currency_code}>{currency.code}</span>
              <span className={styles.currency_name}>({currency.name})</span>
            </button>
          ))}
        </ul>
      )}
    </div>
  );
}

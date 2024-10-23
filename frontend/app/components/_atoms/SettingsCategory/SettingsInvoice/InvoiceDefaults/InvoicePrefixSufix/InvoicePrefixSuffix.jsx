import { useState } from 'react';
import styles from './InvoicePrefixSuffix.module.scss'; // Assure-toi d'avoir ce fichier CSS

const InvoicePrefixSuffix = () => {
  const [isCustom, setIsCustom] = useState(false); // Par défaut, pas de préfixe/suffixe personnalisé
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');

  const handleCheckboxChange = () => {
    setIsCustom(!isCustom);
    if (!isCustom) {
      setPrefix('');
      setSuffix(''); // Clear si on désactive
    }
  };

  const handlePrefixChange = (e) => {
    setPrefix(e.target.value);
  };

  const handleSuffixChange = (e) => {
    setSuffix(e.target.value);
  };

  return (
    <div className={styles.invoicePrefixSuffixContainer}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={isCustom}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
        Add custom prefixes or suffixes
      </label>

      {isCustom && (
        <div className={styles.customFieldsContainer}>
          <input
            type="text"
            value={prefix}
            onChange={handlePrefixChange}
            placeholder="Prefix (e.g. INV-)"
            className={styles.prefixInput}
          />
          <input
            type="text"
            value={suffix}
            onChange={handleSuffixChange}
            placeholder="Suffix (e.g. -2024)"
            className={styles.suffixInput}
          />
        </div>
      )}
    </div>
  );
};

export default InvoicePrefixSuffix;
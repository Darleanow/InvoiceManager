import React from 'react';
import styles from './CompanyName.module.scss';

const CompanyName = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder || 'Company Name'}
      className={styles.companyname_input}
    />
  );
};

export default CompanyName;
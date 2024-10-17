import React, { useState } from 'react';
import styles from './EmailNotifications.module.scss';

const EmailNotifications = () => {
  const [selectedOption, setSelectedOption] = useState('none');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.checkboxLabel}>
        <input 
          type="radio" 
          id="none" 
          name="emailNotifications" 
          value="none" 
          checked={selectedOption === 'none'} 
          onChange={handleOptionChange} 
        />
        <label htmlFor="none">No alerts</label>
      </div>
      <div className={styles.checkboxLabel}>
        <input 
          type="radio" 
          id="overdue" 
          name="emailNotifications" 
          value="overdue" 
          checked={selectedOption === 'overdue'} 
          onChange={handleOptionChange} 
        />
        <label htmlFor="overdue">Alert when an invoice is overdue</label>
      </div>
      <div className={styles.checkboxLabel}>
        <input 
          type="radio" 
          id="paid" 
          name="emailNotifications" 
          value="paid" 
          checked={selectedOption === 'paid'} 
          onChange={handleOptionChange} 
        />
        <label htmlFor="paid">Alert when an invoice is paid</label>
      </div>
    </div>
  );
};

export default EmailNotifications;
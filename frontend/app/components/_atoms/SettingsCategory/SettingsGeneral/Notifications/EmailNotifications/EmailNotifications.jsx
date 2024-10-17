import React from 'react';
import styles from './EmailNotifications.module.scss';

const EmailNotifications = () => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <input type="radio" name="emailNotification" value="overdue" className={styles.radio} />
        When an invoice is overdue
      </label>
      <label className={styles.label}>
        <input type="radio" name="emailNotification" value="paid" className={styles.radio} />
        When an invoice is paid
      </label>
    </div>
  );
};

export default EmailNotifications;
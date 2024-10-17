import React, { useState } from 'react';
import styles from './AppNotifications.module.scss';

const AppNotifications = () => {
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    push: false,
  });

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className={styles.notificationsContainer}>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="email"
          checked={notifications.email}
          onChange={handleChange}
        />
        Email Notifications
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="sms"
          checked={notifications.sms}
          onChange={handleChange}
        />
        SMS Notifications
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="push"
          checked={notifications.push}
          onChange={handleChange}
        />
        Push Notifications
      </label>
    </div>
  );
};

export default AppNotifications;
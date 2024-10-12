import { useState } from 'react';
import NotificationIcon from '../atoms/NotificationIcon';
import NotificationsContent from '../atoms/NotificationsContent';
import styles from './NotificationsDropdown.module.scss';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.dropdown_wrapper} ${isOpen ? styles.open : ''}`}>
      <NotificationIcon onClick={toggleDropdown} />
      <div className={styles.dropdown_content_wrapper}>
        <NotificationsContent />
      </div>
    </div>
  );
}

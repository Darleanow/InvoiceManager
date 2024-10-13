import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import styles from './NotificationsContent.module.scss';

export default function NotificationsContent({
  notifications,
  toggleReadStatus,
}) {
  return (
    <div className={styles.dropdown_content}>
      {notifications.map((notification) => (
        <div key={notification.id} className={styles.notification_item}>
          <a
            href="#"
            className={notification.isRead ? styles.read : styles.unread}
          >
            {notification.text}
          </a>
          <div className={styles.eye_icon}>
            {notification.isRead ? (
              <IoIosEyeOff
                className={styles.icon}
                onClick={() => toggleReadStatus(notification.id)}
              />
            ) : (
              <IoIosEye
                className={styles.icon}
                onClick={() => toggleReadStatus(notification.id)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

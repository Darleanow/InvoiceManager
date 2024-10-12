import PropTypes from 'prop-types';
import { IoIosNotifications } from 'react-icons/io';
import styles from '../../styles/atoms/_icons.module.scss';

export default function NotificationIcon({ onClick }) {
  return (
    <button className={styles.icon_button_container} onClick={onClick}>
      <IoIosNotifications />
    </button>
  );
}

NotificationIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

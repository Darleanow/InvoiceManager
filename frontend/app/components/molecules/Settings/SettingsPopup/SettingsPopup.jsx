import { useState, useEffect } from 'react';
import styles from './SettingsPopup.module.scss';
import {
  IoIosClose,
  IoIosSettings,
  IoIosDocument,
  IoMdPerson,
  IoIosCash,
  IoIosStats,
} from 'react-icons/io';
import SettingsGeneral from '@/app/components/atoms/SettingsCategory/SettingsGeneral/SettingsGeneral';
import SettingsInvoice from '@/app/components/atoms/SettingsCategory/SettingsInvoice/SettingsInvoice';
import SettingsClients from '@/app/components/atoms/SettingsCategory/SettingsClients/SettingsClients';
import SettingsTax from '@/app/components/atoms/SettingsCategory/SettingsTax/SettingsTax';
import SettingsReports from '@/app/components/atoms/SettingsCategory/SettingsReports/SettingsReports';
import SeparatorLine from '@/app/components/atoms/SeparatorLine/SeparatorLine';

export default function SettingsPopup({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const entryTimeout = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(entryTimeout);
  }, []);

  useEffect(() => {
    setIsContentVisible(false);
    const contentTimeout = setTimeout(() => setIsContentVisible(true), 200);
    return () => clearTimeout(contentTimeout);
  }, [selectedCategory]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsClosing(true);
      setTimeout(onClose, 400);
    }
  };

  const categories = [
    { name: 'General', icon: <IoIosSettings /> },
    { name: 'Invoices', icon: <IoIosDocument /> },
    { name: 'Clients', icon: <IoMdPerson /> },
    { name: 'Tax', icon: <IoIosCash /> },
    { name: 'Reports', icon: <IoIosStats /> },
  ];

  const renderContent = () => {
    switch (selectedCategory) {
      case 'General':
        return <SettingsGeneral />;
      case 'Invoices':
        return <SettingsInvoice />;
      case 'Clients':
        return <SettingsClients />;
      case 'Tax':
        return <SettingsTax />;
      case 'Reports':
        return <SettingsReports />;
      default:
        return <SettingsGeneral />;
    }
  };

  return (
    <div
      className={`${styles.popup_backdrop} ${isClosing ? styles.fadeOut : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${styles.popup_container} ${
          isClosing
            ? styles.slideOut
            : isVisible
              ? styles.visible
              : styles.hidden
        }`}
      >
        <IoIosClose
          className={styles.close_icon}
          onClick={handleBackdropClick}
        />
        <div className={styles.popup_main_container}>
          <div className={styles.settings_navbar}>
            {categories.map(({ name, icon }) => (
              <button
                key={name}
                className={
                  selectedCategory === name
                    ? styles.active_nav_item
                    : styles.nav_item
                }
                onClick={() => setSelectedCategory(name)}
              >
                {icon}
                {name}
              </button>
            ))}
          </div>
          <SeparatorLine className={styles.separator_line} />
          <div
            className={`${styles.settings_content} ${isContentVisible ? styles.content_visible : ''}`}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

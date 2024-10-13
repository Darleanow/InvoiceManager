import { useState } from 'react';
import SettingsIcon from '../../atoms/SettingsIcon/SettingsIcon';
import SettingsPopup from './SettingsPopup/SettingsPopup';

export default function Settings() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      <SettingsIcon onClick={togglePopup} />
      {isPopupOpen && <SettingsPopup onClose={togglePopup} />}
    </div>
  );
}

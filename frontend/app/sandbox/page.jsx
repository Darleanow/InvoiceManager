'use client';

import styles from './page.module.scss';

import Logo from '../components/atoms/Logo/Logo';
import SeparatorLine from '../components/atoms/SeparatorLine/SeparatorLine';
import UserDropdown from '../components/molecules/UserDropdown';
import SearchBar from '../components/atoms/Searchbar/SearchBar';
import NotificationsDropdown from '../components/molecules/NotificationsDropdown';
import SettingsIcon from '../components/atoms/SettingsIcon/SettingsIcon';

export default function SandBox() {
  return (
    <div className={styles.main}>
      <Logo />
      <SeparatorLine />
      <UserDropdown />
      {/* <SearchBar /> */}
      <NotificationsDropdown />
      <SettingsIcon
        onClick={() => {
          alert('Settings icon clicked');
        }}
      />
    </div>
  );
}

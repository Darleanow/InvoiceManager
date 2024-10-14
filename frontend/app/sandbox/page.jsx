'use client';

import styles from './page.module.scss';

import Logo from '../components/atoms/Logo/Logo';
import SeparatorLine from '../components/atoms/SeparatorLine/SeparatorLine';
import UserDropdown from '../components/molecules/UserDropdown/UserDropdown';
import SearchBar from '../components/atoms/Searchbar/SearchBar';
import NotificationsDropdown from '../components/molecules/NotificationsDropdown/NotificationsDropdown';
import Settings from '../components/molecules/Settings/Settings';
import CreateInvoiceButton from '../components/atoms/CreateInvoiceButton/CreateInvoiceButton';

export default function SandBox() {
  return (
    <div className={styles.main}>
      <Logo />
      <SeparatorLine />
      <UserDropdown />
      <SearchBar />
      <NotificationsDropdown />
      <Settings />
      <SeparatorLine />
      <CreateInvoiceButton />
    </div>
  );
}

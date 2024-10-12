import styles from './page.module.scss';

import Logo from '../components/atoms/Logo';
import SeparatorLine from '../components/atoms/SeparatorLine';
import UserDropdown from '../components/molecules/UserDropdown';
import SearchBar from '../components/atoms/SearchBar';

export default function SandBox() {
  return (
    <div className={styles.main}>
      <Logo />
      <SeparatorLine />
      <UserDropdown />
      <SearchBar />
    </div>
  );
}

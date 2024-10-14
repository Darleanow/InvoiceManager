import styles from './HomePage.module.scss';

import TopBar from '../../_organisms/TopBar/TopBar';
import NavBar from '../../_organisms/NavBar/NavBar';

export default function HomePage() {
  return (
    <div className={styles.home_page}>
      <TopBar />
      <NavBar />
    </div>
  );
}

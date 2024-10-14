import styles from './HomePage.module.scss';

import TopBar from '../../_organisms/TopBar/TopBar';

export default function HomePage() {
  return (
    <div className={styles.home_page}>
      <TopBar />
    </div>
  );
}

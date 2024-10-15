'use client';

import HomePage from '../components/_templates/HomePage/HomePage';
import styles from './page.module.scss';

export default function SandBox() {
  return (
    <div className={styles.main}>
      <HomePage />
    </div>
  );
}

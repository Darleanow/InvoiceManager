'use client';

import styles from './page.module.scss';
import CreateInvoiceBar from '../components/_organisms/CreateInvoiceBar/CreateInvoiceBar';

export default function SandBox() {
  return (
    <div className={styles.main}>
      <CreateInvoiceBar />
    </div>
  );
}

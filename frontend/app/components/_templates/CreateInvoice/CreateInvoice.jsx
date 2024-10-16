import CreateInvoiceBar from '../../_organisms/CreateInvoiceBar/CreateInvoiceBar';
import styles from './CreateInvoice.module.scss';

export default function CreateInvoice() {
  return (
    <div className={styles.page_container}>
      <CreateInvoiceBar />
      <div className={styles.main_content}></div>
    </div>
  );
}

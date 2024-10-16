import CreateInvoiceBar from '../../_organisms/CreateInvoiceBar/CreateInvoiceBar';
import styles from './CreateInvoice.module.scss';
import HorizontalSeparatorLine from '../../_atoms/HoriontalSeparatorLine/HorizontalSeparatorLine';
import FormInput from '../../_atoms/FormInput/FormInput';
import ClientFormInput from '../../_molecules/ClientFormInput/ClientFormInput';
export default function CreateInvoice() {
  return (
    <div className={styles.page_container}>
      <CreateInvoiceBar />
      <div className={styles.main_content}>
        <div className={styles.left_panel}>
          <h3>Create Invoice</h3>
          <p>Client</p>
          <ClientFormInput />
          <p>Subject</p>
          <FormInput />
          <p>Due date</p>
          <FormInput />
          <p>Currency</p>
          <FormInput />
          <HorizontalSeparatorLine />
          <h3>Product</h3>
          <p>Item</p>
          <FormInput />
          <HorizontalSeparatorLine />
          <h3>Additional Options</h3>
          <p>Terms & Conditions</p>
          <p>Attachement</p>
          <p>Customer Notes</p>
          <p>Footer</p>
          <div className={styles.footer}>
            <p>Last saved: today 4:20pm</p>
            <div className={styles.buttons}>
              <button className={styles.cancel_button}>Cancel</button>
              <button className={styles.download_button}>Download</button>
            </div>
          </div>
        </div>
        <div className={styles.right_panel}></div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import PropTypes from 'prop-types';
import { AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import styles from './EditForm.module.scss';

export default function EditForm({
  editableClient,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleCancelClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onCancelEdit();
    }, 400); // Match the duration of the closing animation (400ms)
  };

  const handleSaveClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onSaveEdit();
    }, 400); // Match the duration of the closing animation (400ms)
  };

  return (
    <div
      className={`${styles.editForm} ${isClosing ? styles.editFormClosing : ''}`}
    >
      <input
        type="text"
        name="name"
        value={editableClient.name}
        onChange={onEditChange}
        className={styles.editInput}
      />
      <input
        type="email"
        name="email"
        value={editableClient.email}
        onChange={onEditChange}
        className={styles.editInput}
      />
      <input
        type="text"
        name="phone"
        value={editableClient.phone}
        onChange={onEditChange}
        className={styles.editInput}
      />
      <input
        type="text"
        name="address"
        value={editableClient.address}
        onChange={onEditChange}
        className={styles.editInput}
      />
      <div className={styles.actionButtons}>
        <button className={styles.cancelButton} onClick={handleCancelClick}>
          <AiOutlineClose /> Cancel
        </button>
        <button className={styles.saveButton} onClick={handleSaveClick}>
          <AiOutlineSave /> Save
        </button>
      </div>
    </div>
  );
}

EditForm.propTypes = {
  editableClient: PropTypes.object.isRequired,
  onEditChange: PropTypes.func.isRequired,
  onSaveEdit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

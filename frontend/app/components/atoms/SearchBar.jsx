'use client';

import styles from './SearchBar.module.scss';
import { IoIosSearch } from 'react-icons/io';
import { useRef } from 'react';

export default function SearchBar() {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={styles.searchbar_container} onClick={handleContainerClick}>
      <IoIosSearch className={styles.icon} />
      <input
        type="text"
        placeholder="Search"
        className={styles.search_input}
        ref={inputRef}
      />
    </div>
  );
}

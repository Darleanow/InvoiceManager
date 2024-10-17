import React, { useState } from 'react';
import styles from './DateFormat.module.scss';
const DateFormat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('MM/DD/YYYY');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectFormat = (format) => {
    setSelectedFormat(format);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button className='button'
        onClick={toggleDropdown}
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '10px',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        {selectedFormat}
      </button>
      {isOpen && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            backgroundColor: 'white',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            zIndex: '1',
            listStyle: 'none',
            padding: '0',
            margin: '0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          <li
            style={{ padding: '10px', cursor: 'pointer' }}
            onClick={() => selectFormat('MM/DD/YYYY')}
          >
            MM/DD/YYYY
          </li>
          <li
            style={{ padding: '10px', cursor: 'pointer' }}
            onClick={() => selectFormat('DD/MM/YYYY')}
          >
            DD/MM/YYYY
          </li>
          <li
            style={{ padding: '10px', cursor: 'pointer' }}
            onClick={() => selectFormat('YYYY-MM-DD')}
          >
            YYYY-MM-DD
          </li>
        </ul>
      )}
    </div>
  );
};

export default DateFormat;
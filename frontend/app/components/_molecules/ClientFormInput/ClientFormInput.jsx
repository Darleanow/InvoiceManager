'use client';

import React, { useState, useRef, useEffect } from 'react';
import FormInput from '../../_atoms/FormInput/FormInput';
import FormDropdown from '../../_atoms/FormDropdown/FormDropdown';
import ClientWidget from '../../_molecules/ClientWidget/ClientWidget';
import styles from './ClientFormInput.module.scss';

export default function ClientFormInput() {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controls dropdown state
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableClient, setEditableClient] = useState(null);
  const dropdownRef = useRef(null);

  const clients = [
    {
      id: 1,
      avatar: 'https://example.com/avatar1.jpg',
      name: 'Client A',
      email: 'clienta@example.com',
      phone: '123-456-7890',
      address: '123 Main St, City A',
    },
    {
      id: 2,
      avatar: 'https://example.com/avatar2.jpg',
      name: 'Client B',
      email: 'clientb@example.com',
      phone: '987-654-3210',
      address: '456 Oak St, City B',
    },
    {
      id: 3,
      avatar: 'https://example.com/avatar3.jpg',
      name: 'Client C',
      email: 'clientc@example.com',
      phone: '555-555-5555',
      address: '789 Pine St, City C',
    },
  ];

  // Update input value and open dropdown when user types
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownOpen(e.target.value !== ''); // Open dropdown when input is not empty
  };

  // Handle focus on input to open dropdown
  const handleInputFocus = () => {
    if (inputValue) {
      setIsDropdownOpen(true); // Open dropdown if there's a value in the input
    }
  };

  // Handle clicking outside dropdown to close it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Close dropdown when clicking outside
    }
  };

  // Setup click listener for outside clicks
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle client selection from dropdown
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setIsDropdownOpen(false); // Close dropdown when client is selected
    setInputValue(''); // Clear input
    setIsEditing(false);
  };

  // Reset selected client
  const handleResetClient = () => {
    setSelectedClient(null);
    setInputValue(''); // Clear input when resetting client
  };

  // Handle editing client details
  const handleEditClient = () => {
    setEditableClient({ ...selectedClient });
    setIsEditing(true); // Start editing mode
  };

  // Update client details while editing
  const handleEditChange = (e) => {
    setEditableClient({
      ...editableClient,
      [e.target.name]: e.target.value,
    });
  };

  // Save edited client details
  const handleSaveEdit = () => {
    setSelectedClient(editableClient); // Save edited client
    setIsEditing(false); // End editing mode
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Filter clients based on input value
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={styles.client_form_input} ref={dropdownRef}>
      {selectedClient ? (
        <ClientWidget
          client={selectedClient}
          editableClient={editableClient}
          isEditing={isEditing}
          onReset={handleResetClient}
          onEdit={handleEditClient}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onEditChange={handleEditChange}
        />
      ) : (
        <FormInput
          type="text"
          placeholder="Client Name"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          isDropdownOpen={isDropdownOpen}
        />
      )}
      {isDropdownOpen && (
        <FormDropdown
          data={filteredClients}
          isOpen={isDropdownOpen}
          onSelect={handleClientSelect}
        />
      )}
    </div>
  );
}

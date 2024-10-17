import React from 'react';
import CompanyName from './CompanyName/CompanyName';
import CompanyLogo from './CompanyLogo/CompanyLogo';
import ContactInformation from './ContactInformation/ContactInformation';
import Adress from './Adress/Adress';

export default function SettingsGeneral() {
  return (
    <div>
      <h1>SettingsGeneral</h1>
      <CompanyName />
      <CompanyLogo />
      <ContactInformation />
      <Adress />
    </div>
  );
}

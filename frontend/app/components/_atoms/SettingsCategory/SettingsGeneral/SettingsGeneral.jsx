import React from 'react';
import CompanyName from './CompanyDetails/CompanyName/CompanyName';
import CompanyLogo from './CompanyDetails/CompanyLogo/CompanyLogo';
import ContactInformation from './CompanyDetails/ContactInformation/ContactInformation';
import Adress from './CompanyDetails/Adress/Adress';

export default function SettingsGeneral() {
  return (
    <div>
      <h1>SettingsGeneral</h1>
      <div className={styles.general_container}>
        <h1> Company Details</h1>
        <CompanyName />
        <CompanyLogo />
        <ContactInformation />
        <Adress />
      </div>
    </div>
  );
}

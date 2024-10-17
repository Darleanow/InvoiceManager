import React from 'react';
import CompanyName from './CompanyDetails/CompanyName/CompanyName';
import CompanyLogo from './CompanyDetails/CompanyLogo/CompanyLogo';
import ContactInformation from './CompanyDetails/ContactInformation/ContactInformation';
import Adress from './CompanyDetails/Adress/Adress';
import DateFormat from './Localization/DateFormat/DateFormat'; 
import TimeZone from './Localization/TimeZone/TimeZone';
import Language from './Localization/Language/Language';
import DefaultCurrency from './Currency/DefaultCurrency/DefaultCurrency';
import CurrencySymbolPosition from './Currency/DefaultCurrency/CurrencySymbolPosition/CurrencySymbolPosition';

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
      <div className={styles.localization_container}>
        <h1>Localization</h1>
        <DateFormat/>
        <TimeZone/>
        <Language/>
      </div>
      <div className='currency_container'>
        <h1>Currency</h1>
        <DefaultCurrency/>
        <CurrencySymbolPosition/>
      </div>
    </div>
  );
}

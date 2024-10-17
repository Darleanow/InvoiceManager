import React from 'react';
import CompanyName from './CompanyDetails/CompanyName/CompanyName';
import CompanyLogo from './CompanyDetails/CompanyLogo/CompanyLogo';
import ContactInformation from './CompanyDetails/ContactInformation/ContactInformation';
import Adress from './CompanyDetails/Adress/Adress';
import DateFormat from './Localization/DateFormat/DateFormat'; 
import TimeZone from './Localization/TimeZone/TimeZone';
import Language from './Localization/Language/Language';
import DefaultCurrency from './Currency/DefaultCurrency/DefaultCurrency';
import CurrencySymbolPosition from './Currency/CurrencySymbolPosition/CurrencySymbolPosition';

import styles from './SettingsGeneral.module.scss';

export default function SettingsGeneral() {
  return (
    <div>
      <h1 className={styles.title}>SettingsGeneral</h1>
      <div className={styles.general_container}>
        <h3> Company Details</h3>
        <CompanyName />
        <CompanyLogo />
        <ContactInformation />
        <Adress />
      </div>
      <div className={styles.localization_container}>
        <h3>Localization</h3>
        <DateFormat/>
        <TimeZone/>
        <Language/>
      </div>
      <div className={styles.currency_container}>
        <h3>Currency</h3>
        <DefaultCurrency/>
        <CurrencySymbolPosition/>
      </div>
    </div>
  );
}

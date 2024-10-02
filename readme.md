# Invoice Manager

---

## CI/CD & Quality Status

<div align="center">
  <!-- Group the CI and Quality badges in a styled box -->
  <table>
    <tr>
      <td><img src="https://github.com/Darleanow/InvoiceManager/actions/workflows/main.yml/badge.svg" alt="CI"></td>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=alert_status" alt="Quality Gate Status"></td>
    </tr>
  </table>
</div>

---

## Project Metrics

<div align="center">
  <!-- Group the metric-related badges -->
  <table>
    <tr>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=bugs" alt="Bugs"></td>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=code_smells" alt="Code Smells"></td>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=coverage" alt="Coverage"></td>
    </tr>
    <tr>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=duplicated_lines_density" alt="Duplicated Lines (%)"></td>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=ncloc" alt="Lines of Code"></td>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=reliability_rating" alt="Reliability Rating"></td>
    </tr>
  </table>
</div>

---

## Security & Maintainability

<div align="center">
  <!-- Group the security and maintainability badges -->
  <table>
    <tr>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=security_rating" alt="Security Rating"></td>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=sqale_index" alt="Technical Debt"></td>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=sqale_rating" alt="Maintainability Rating"></td>
      <td><img src="https://sonarcloud.io/api/project_badges/measure?project=Darleanow_InvoiceManager&metric=vulnerabilities" alt="Vulnerabilities"></td>
    </tr>
  </table>
</div>

---

📄 SPÉCIFICATIONS DE L'APPLICATION DE GÉNÉRATION DE FACTURES

---

## 1️⃣ FONCTIONNALITÉS PRINCIPALES

### Génération de factures personnalisées

L'application permet de générer des factures au format Word (.docx), avec possibilité d'exporter en PDF et .txt.
Les balises dans le modèle sont automatiquement remplacées par les données saisies via un formulaire utilisateur.

### Formulaire de création de facture

Interface utilisateur pour saisir : nom du client, adresse, objet de la facture, quantité, prix unitaire, etc.
Validation des champs pour garantir la complétude des données.

### Téléchargement automatique

Après soumission du formulaire, la facture est générée et téléchargée automatiquement dans le format sélectionné.

### Format personnalisé du numéro de facture

Le numéro de facture suit un format basé sur le client, l'année et le mois, selon les règles définies :
ESGI : F-ESGI-ANNEE-MOIS#<numéro>
TOTO : F-TOTO-ANNEE-MOIS#<numéro>
Incrémentation automatique en fonction des factures déjà émises.

### Stockage de l'historique des factures en BDD (par défaut)

Chaque facture est enregistrée en base de données pour permettre un suivi complet.
Les informations de chaque facture sont stockées pour permettre la consultation et réédition via une interface dédiée.

### Stockage des règles de gestion en BDD (par défaut)

Les règles de gestion des numéros de facture sont stockées en base de données pour une gestion dynamique.
Possibilité de modifier les règles via l'interface (ajout de clients, modifications des formats de numéros).

### Support multiformat à l'export (par défaut)

Exportation des factures dans différents formats : .docx, .pdf, et .txt.
L'utilisateur choisit le format lors de la génération de la facture.

---

## 2️⃣ SPÉCIFICATIONS TECHNIQUES

### Base de données

Les informations sur les factures et les règles de gestion sont stockées en BDD.

#### Tables

factures (informations de chaque facture)
regles_gestion (règles spécifiques à chaque client).
Traçabilité des factures et gestion souple des règles.

#### Modèle de document

Le modèle de facture contient des balises dynamiques ({{client_nom}}, {{numero_facture}}, etc.).
Remplacement automatique des balises par les données du formulaire.

#### Incrémentation automatique des numéros de facture

Incrémentation automatique des numéros sans duplication pour un même client et mois.

#### Consultation et gestion de l'historique

Interface permettant de consulter l'historique des factures, les filtrer, les rééditer ou les renvoyer.

#### Exportation des factures

Export dans le format choisi (Word, PDF, texte).

---

## 3️⃣ CONCLUSION

L'application utilise une base de données pour stocker l'historique des factures et les règles de gestion. Elle permet la génération flexible et centralisée des factures, le suivi de l'historique et l'ajustement dynamique des règles, tout en offrant plusieurs formats d'export.

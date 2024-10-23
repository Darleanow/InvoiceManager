export function getInvoiceStyles() {
  return `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif !important;
      color: #dadada !important;
    }
    
    body {
      background-color: #1f1f23 !important;
    }

    .invoice_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.invoice_title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dadada;
  margin: 0;
}

.invoice_title p {
  color: #828282;
  margin: 5px 0;
}

.due_date {
  text-align: right;
}

.due_date .label {
  font-weight: 700;
  color: #e29c23;
}

.bill_to,
.subject {
  margin-bottom: 2rem;
}

.bill_to h3,
.subject h3 {
  color: #cacaca;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.bill_to p,
.subject p {
  font-weight: 700;
  color: #dadada;
}

.table {
  width: 100%;
  margin-bottom: 2rem;
  border-collapse: collapse;
  border: 1px solid #2e2e32;
}

.table th,
.table td {
  padding: 0.5rem;
  border: 1px solid #2e2e32;
}

.table th {
  text-align: left;
  font-weight: 600;
  color: #cacaca;
  background-color: #1f1f23;
}

.table th:not(:first-child) {
  text-align: right;
}

.table td {
  color: #dadada;
  background-color: #26262a;
}

.table td:not(:first-child) {
  text-align: right;
}

.totals {
  display: flex;
  justify-content: flex-end;
}

.totals_content {
  width: 33.333%;
}

.totals_row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #cacaca;
}

.totals_row.total {
  font-weight: 700;
  border-top: 1px solid #2e2e32;
  padding-top: 0.5rem;
  color: #e29c23;
}

  `;
}

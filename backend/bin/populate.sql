USE Invoice_Manager;

SET FOREIGN_KEY_CHECKS = 0;

-- Insert Users
INSERT INTO `User` (first_name, last_name, username, email, password, role) VALUES
('John', 'Admin', 'jadmin', 'john.admin@example.com', 'hashed_password_1', 'admin'),
('Sarah', 'Manager', 'smanager', 'sarah.manager@example.com', 'hashed_password_2', 'manager'),
('Mike', 'Handler', 'mhandler', 'mike.handler@example.com', 'hashed_password_3', 'manager');

-- Insert Clients
INSERT INTO `Client` (email, phone, type, address) VALUES
('acme.corp@example.com', '555-0100', 'company', '123 Business Ave, Suite 100'),
('john.doe@example.com', '555-0101', 'individual', '456 Residential St'),
('tech.solutions@example.com', '555-0102', 'company', '789 Innovation Park'),
('jane.smith@example.com', '555-0103', 'individual', '321 Home Lane');

-- Insert Client Companies
INSERT INTO `Client_Company` (client_id, company_name) VALUES
(1, 'Acme Corporation'),
(3, 'Tech Solutions Inc.');

-- Insert Client Individuals
INSERT INTO `Client_Individual` (client_id, first_name, last_name) VALUES
(2, 'John', 'Doe'),
(4, 'Jane', 'Smith');

-- Insert Templates
INSERT INTO `Template` (template_name) VALUES
('Standard Invoice'),
('Professional Services'),
('Detailed Receipt');

-- Insert Items
INSERT INTO `Item` (name, description, default_price, type) VALUES
('Web Development', 'Professional web development services', 150.00, 'service'),
('Consultation', 'Expert consultation session', 200.00, 'service'),
('Server Hardware', 'High-performance server', 1999.99, 'product'),
('Software License', 'Annual software license', 499.99, 'product');

-- Insert Taxes
INSERT INTO `Tax` (name, rate, apply_by_default) VALUES
('Standard VAT', 20.00, true),
('Reduced Rate', 10.00, false),
('Zero Rate', 0.00, false);

-- Insert Discounts
INSERT INTO `Discount` (name, type, value) VALUES
('Early Payment', 'percentage', 5.00),
('Bulk Purchase', 'fixed', 100.00),
('Loyalty Discount', 'percentage', 10.00);

-- Insert Invoices
INSERT INTO `Invoice` (
    invoice_number, client_id, user_id, template_id, 
    creation_date, expiration_date, state, 
    currency, invoice_name, invoice_subject, 
    total_amount, subtotal
) VALUES
('INV-2024-001', 1, 1, 1, '2024-01-01', '2024-02-01', 'sent', 'USD', 'January Services', 'Web Development Services', 1500.00, 1500.00),
('INV-2024-002', 2, 2, 1, '2024-01-15', '2024-02-15', 'paid', 'USD', 'Consultation', 'Expert Consultation Services', 200.00, 200.00),
('INV-2024-003', 3, 1, 2, '2024-02-01', '2024-03-01', 'draft', 'USD', 'Hardware Purchase', 'Server Hardware', 1999.99, 1999.99);

-- Then insert invoice lines
INSERT INTO `Invoice_Line` (invoice_id, item_id, quantity, price, description) VALUES
(1, 1, 10, 150.00, 'Web Development - 10 hours'),
(2, 2, 1, 200.00, 'Consultation Session'),
(3, 3, 1, 1999.99, 'Server Hardware Purchase');

-- Insert Invoice Taxes
INSERT INTO `Invoice_Tax` (invoice_id, tax_id) VALUES
(1, 1),
(2, 1),
(3, 1);

-- Insert Invoice Discounts
INSERT INTO `Invoice_Discount` (invoice_id, discount_id) VALUES
(1, 1),
(2, 3);

-- Insert some history records
INSERT INTO `Invoice_History` (invoice_id, previous_state, new_state, changed_by_user_id) VALUES
(1, 'draft', 'sent', 1),
(2, 'draft', 'sent', 2),
(2, 'sent', 'paid', 2);

-- Insert some attachments (without actual file data for this example)
INSERT INTO `Attachment` (invoice_id, file_name, file_data, extension) VALUES
(1, 'invoice-details', '', 'pdf'),
(2, 'receipt', '', 'pdf');

SET FOREIGN_KEY_CHECKS = 1;

-- Example of how to use the populated data:
-- SELECT * FROM Invoice WHERE client_id = 1;
-- SELECT * FROM Invoice_Line WHERE invoice_id = 1;
-- SELECT * FROM Invoice_History WHERE invoice_id = 2;
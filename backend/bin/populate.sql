USE Invoice_Manager;

SET FOREIGN_KEY_CHECKS = 0;

-- Create and populate Constants table
CREATE TABLE IF NOT EXISTS `Constants` (
    `key` VARCHAR(50) PRIMARY KEY,
    `value` VARCHAR(50) NOT NULL
);

-- Insert all constants
INSERT IGNORE INTO `Constants` (`key`, `value`) VALUES
    -- Invoice States
    ('INVOICE_STATE_DRAFT', 'draft'),
    ('INVOICE_STATE_SENT', 'sent'),
    ('INVOICE_STATE_PAID', 'paid'),
    
    -- Client Types
    ('CLIENT_TYPE_COMPANY', 'company'),
    ('CLIENT_TYPE_INDIVIDUAL', 'individual'),
    
    -- Item Types
    ('ITEM_TYPE_SERVICE', 'service'),
    ('ITEM_TYPE_PRODUCT', 'product'),
    
    -- User Roles
    ('USER_ROLE_ADMIN', 'admin'),
    ('USER_ROLE_MANAGER', 'manager'),
    
    -- Currencies
    ('CURRENCY_USD', 'USD'),
    
    -- Discount Types
    ('DISCOUNT_TYPE_PERCENTAGE', 'percentage'),
    ('DISCOUNT_TYPE_FIXED', 'fixed');

-- Insert Users
INSERT INTO `User` (clerk_user_id, first_name, last_name, username, email, role) 
SELECT 
    'user_2aX9NB1', 'John', 'Admin', 'jadmin', 'john.admin@example.com', 
    (SELECT value FROM Constants WHERE `key` = 'USER_ROLE_ADMIN')
UNION ALL
SELECT 
    'user_7bY3MC2', 'Sarah', 'Manager', 'smanager', 'sarah.manager@example.com',
    (SELECT value FROM Constants WHERE `key` = 'USER_ROLE_MANAGER')
UNION ALL
SELECT 
    'user_4cZ8LD3', 'Mike', 'Handler', 'mhandler', 'mike.handler@example.com',
    (SELECT value FROM Constants WHERE `key` = 'USER_ROLE_MANAGER');

-- Insert Clients
INSERT INTO `Client` (email, phone, type, address) 
SELECT 
    'acme.corp@example.com', '555-0100',
    (SELECT value FROM Constants WHERE `key` = 'CLIENT_TYPE_COMPANY'),
    '123 Business Ave, Suite 100'
UNION ALL
SELECT 
    'john.doe@example.com', '555-0101',
    (SELECT value FROM Constants WHERE `key` = 'CLIENT_TYPE_INDIVIDUAL'),
    '456 Residential St'
UNION ALL
SELECT 
    'tech.solutions@example.com', '555-0102',
    (SELECT value FROM Constants WHERE `key` = 'CLIENT_TYPE_COMPANY'),
    '789 Innovation Park'
UNION ALL
SELECT 
    'jane.smith@example.com', '555-0103',
    (SELECT value FROM Constants WHERE `key` = 'CLIENT_TYPE_INDIVIDUAL'),
    '321 Home Lane';

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
INSERT INTO `Item` (name, description, default_price, type) 
SELECT 
    'Web Development', 'Professional web development services', 150.00,
    (SELECT value FROM Constants WHERE `key` = 'ITEM_TYPE_SERVICE')
UNION ALL
SELECT 
    'Consultation', 'Expert consultation session', 200.00,
    (SELECT value FROM Constants WHERE `key` = 'ITEM_TYPE_SERVICE')
UNION ALL
SELECT 
    'Server Hardware', 'High-performance server', 1999.99,
    (SELECT value FROM Constants WHERE `key` = 'ITEM_TYPE_PRODUCT')
UNION ALL
SELECT 
    'Software License', 'Annual software license', 499.99,
    (SELECT value FROM Constants WHERE `key` = 'ITEM_TYPE_PRODUCT');

-- Insert Taxes
INSERT INTO `Tax` (name, rate, apply_by_default) VALUES
('Standard VAT', 20.00, true),
('Reduced Rate', 10.00, false),
('Zero Rate', 0.00, false);

-- Insert Discounts
INSERT INTO `Discount` (name, type, value) 
SELECT 
    'Early Payment',
    (SELECT value FROM Constants WHERE `key` = 'DISCOUNT_TYPE_PERCENTAGE'),
    5.00
UNION ALL
SELECT 
    'Bulk Purchase',
    (SELECT value FROM Constants WHERE `key` = 'DISCOUNT_TYPE_FIXED'),
    100.00
UNION ALL
SELECT 
    'Loyalty Discount',
    (SELECT value FROM Constants WHERE `key` = 'DISCOUNT_TYPE_PERCENTAGE'),
    10.00;

-- Insert Invoices
INSERT INTO `Invoice` (
    invoice_number, client_id, user_id, template_id, 
    creation_date, expiration_date, state, 
    currency, notes, invoice_subject,
    total_amount, subtotal
) 
SELECT 
    'INV-2024-001', 1, 1, 1, 
    CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_SENT'),
    (SELECT value FROM Constants WHERE `key` = 'CURRENCY_USD'),
    'Standard payment terms apply', 'Web Development Services',
    1500.00, 1500.00
UNION ALL
SELECT 
    'INV-2024-002', 2, 2, 1, 
    CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_PAID'),
    (SELECT value FROM Constants WHERE `key` = 'CURRENCY_USD'),
    'Paid in full', 'Expert Consultation Services',
    200.00, 200.00
UNION ALL
SELECT 
    'INV-2024-003', 3, 1, 2, 
    CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_DRAFT'),
    (SELECT value FROM Constants WHERE `key` = 'CURRENCY_USD'),
    'Hardware purchase order', 'Server Hardware',
    1999.99, 1999.99;

-- Insert Invoice Lines
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

-- Insert Invoice History
INSERT INTO `Invoice_History` (
    invoice_id, 
    previous_state, 
    new_state, 
    changed_by_user_id
)
SELECT 
    1,
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_DRAFT'),
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_SENT'),
    1
UNION ALL
SELECT
    2,
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_DRAFT'),
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_SENT'),
    2
UNION ALL
SELECT
    2,
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_SENT'),
    (SELECT value FROM Constants WHERE `key` = 'INVOICE_STATE_PAID'),
    2;

-- Insert attachments with placeholder file data
INSERT INTO `Attachment` (
    invoice_id, 
    file_name, 
    file_data, 
    extension
) VALUES
(1, 'invoice-001-details', UNHEX('89504E470D0A1A0A'), 'pdf'),
(2, 'receipt-002', UNHEX('89504E470D0A1A0A'), 'pdf');

SET FOREIGN_KEY_CHECKS = 1;
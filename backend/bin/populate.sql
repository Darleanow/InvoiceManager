USE invoice_manager;

SET FOREIGN_KEY_CHECKS = 0;

-- Insert benefits
INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES 
('Health Insurance', 12, 100),
('Gym Membership', 1, 50),
('Life Insurance', 12, 200),
('Dental Care', 6, 75),
('Car Insurance', 12, 120),
('Home Insurance', 12, 150),
('Travel Insurance', 1, 60),
('Pet Insurance', 12, 80),
('Vision Care', 6, 40),
('Disability Insurance', 12, 180),
('Income Protection', 12, 170),
('Legal Insurance', 12, 90),
('Critical Illness', 12, 250),
('Accident Insurance', 1, 30),
('Retirement Plan', 12, 300),
('Student Loan Repayment', 12, 130),
('Tuition Reimbursement', 12, 110),
('Adoption Assistance', 12, 90),
('Wellness Program', 12, 40),
('Meal Subsidy', 1, 20);

-- Insert customers
INSERT INTO invoice_manager.customer (name, email, postal_address) VALUES 
('John Doe', 'johndoe@example.com', '123 Main St, Springfield, IL'),
('Jane Smith', 'janesmith@example.com', '456 Oak St, Springfield, IL'),
('Michael Brown', 'michaelbrown@example.com', '789 Pine St, Springfield, IL'),
('Emily Johnson', 'emilyjohnson@example.com', '321 Cedar St, Springfield, IL'),
('Chris Davis', 'chrisdavis@example.com', '654 Birch St, Springfield, IL');

-- Insert invoices and associate with customer and benefits in one go
-- Customer 1: John Doe
INSERT INTO invoice_manager.invoice (name, date) 
VALUES ('Invoice for John Doe - Health Package', '2024-01-15');
SET @invoice_id = LAST_INSERT_ID();
INSERT INTO invoice_manager.customer_invoice (customer_id, invoice_id) VALUES (1, @invoice_id);
INSERT INTO invoice_manager.invoice_benefit (invoice_id, benefit_id) VALUES (@invoice_id, 1), (@invoice_id, 2);

-- Customer 2: Jane Smith
INSERT INTO invoice_manager.invoice (name, date) 
VALUES ('Invoice for Jane Smith - Travel Package', '2024-01-10');
SET @invoice_id = LAST_INSERT_ID();
INSERT INTO invoice_manager.customer_invoice (customer_id, invoice_id) VALUES (2, @invoice_id);
INSERT INTO invoice_manager.invoice_benefit (invoice_id, benefit_id) VALUES (@invoice_id, 7), (@invoice_id, 15);

-- Customer 3: Michael Brown
INSERT INTO invoice_manager.invoice (name, date) 
VALUES ('Invoice for Michael Brown - Retirement Plan', '2024-02-10');
SET @invoice_id = LAST_INSERT_ID();
INSERT INTO invoice_manager.customer_invoice (customer_id, invoice_id) VALUES (3, @invoice_id);
INSERT INTO invoice_manager.invoice_benefit (invoice_id, benefit_id) VALUES (@invoice_id, 11);

-- Customer 4: Emily Johnson
INSERT INTO invoice_manager.invoice (name, date) 
VALUES ('Invoice for Emily Johnson - Tuition Reimbursement', '2024-01-30');
SET @invoice_id = LAST_INSERT_ID();
INSERT INTO invoice_manager.customer_invoice (customer_id, invoice_id) VALUES (4, @invoice_id);
INSERT INTO invoice_manager.invoice_benefit (invoice_id, benefit_id) VALUES (@invoice_id, 17);

-- Customer 5: Chris Davis
INSERT INTO invoice_manager.invoice (name, date) 
VALUES ('Invoice for Chris Davis - Critical Illness Plan', '2024-04-15');
SET @invoice_id = LAST_INSERT_ID();
INSERT INTO invoice_manager.customer_invoice (customer_id, invoice_id) VALUES (5, @invoice_id);
INSERT INTO invoice_manager.invoice_benefit (invoice_id, benefit_id) VALUES (@invoice_id, 13);

SET FOREIGN_KEY_CHECKS = 1;

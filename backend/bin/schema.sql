DROP DATABASE IF EXISTS Invoice_Manager;
CREATE DATABASE Invoice_Manager;
USE Invoice_Manager;

CREATE TABLE `User` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('manager', 'admin') NOT NULL DEFAULT 'manager',
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_login` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_email UNIQUE (email),
    CONSTRAINT unique_username UNIQUE (username)
);

CREATE TABLE `Client` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `type` ENUM('individual', 'company') NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `image` MEDIUMBLOB NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_client_email UNIQUE (email)
);

CREATE TABLE `Client_Individual` (
    `client_id` INT UNSIGNED NOT NULL PRIMARY KEY,
    `last_name` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE CASCADE
);

CREATE TABLE `Client_Company` (
    `client_id` INT UNSIGNED NOT NULL PRIMARY KEY,
    `company_name` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE CASCADE
);

CREATE TABLE `Template` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `template_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `Invoice` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `invoice_number` VARCHAR(50) NOT NULL,
    `client_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `template_id` INT UNSIGNED NOT NULL,
    `creation_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expiration_date` TIMESTAMP NOT NULL,
    `state` ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'draft',
    `total_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `currency` VARCHAR(3) NOT NULL,
    `private_notes` TEXT NULL,
    `invoice_name` VARCHAR(255) NOT NULL,
    `invoice_subject` VARCHAR(255) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_invoice_number UNIQUE (invoice_number),
    FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`),
    FOREIGN KEY (`user_id`) REFERENCES `User`(`id`),
    FOREIGN KEY (`template_id`) REFERENCES `Template`(`id`)
);

CREATE TABLE `Item` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `default_price` DECIMAL(10, 2) NOT NULL,
    `type` ENUM('product', 'service') NOT NULL,
    `image` MEDIUMBLOB NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT check_positive_default_price CHECK (default_price >= 0)
);

CREATE TABLE `Invoice_Line` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `invoice_id` INT UNSIGNED NOT NULL,
    `item_id` INT UNSIGNED NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE SET NULL,
    CONSTRAINT check_positive_quantity CHECK (quantity > 0),
    CONSTRAINT check_positive_price CHECK (price >= 0)
);



CREATE TABLE `Tax` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `rate` DECIMAL(8, 2) NOT NULL,
    `apply_by_default` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_tax_rate CHECK (rate >= 0 AND rate <= 100)
);

CREATE TABLE `Discount` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('percentage', 'fixed') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_discount CHECK (
        (type = 'percentage' AND value >= 0 AND value <= 100) OR
        (type = 'fixed' AND value >= 0)
    )
);

CREATE TABLE `Invoice_Tax` (
    `invoice_id` INT UNSIGNED NOT NULL,
    `tax_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`invoice_id`, `tax_id`),
    FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tax_id`) REFERENCES `Tax`(`id`) ON DELETE CASCADE
);

CREATE TABLE `Invoice_Discount` (
    `invoice_id` INT UNSIGNED NOT NULL,
    `discount_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`invoice_id`, `discount_id`),
    FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`discount_id`) REFERENCES `Discount`(`id`) ON DELETE CASCADE
);

CREATE TABLE `Invoice_History` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `invoice_id` INT UNSIGNED NOT NULL,
    `previous_state` ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') NOT NULL,
    `new_state` ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') NOT NULL,
    `state_change_timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `changed_by_user_id` INT UNSIGNED NULL,
    FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`changed_by_user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL
);

CREATE TABLE `Invoice_Log` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `invoice_id` INT UNSIGNED NOT NULL,
    `modification_type` ENUM('create', 'update', 'delete') NOT NULL,
    `old_value` TEXT NULL,
    `new_value` TEXT NULL,
    `modification_timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `changed_by_user_id` INT UNSIGNED NULL,
    `details` TEXT NULL,
    FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`),
    FOREIGN KEY (`changed_by_user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL
);

CREATE TABLE `Attachment` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `invoice_id` INT UNSIGNED NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_data` MEDIUMBLOB NOT NULL,
    `extension` ENUM('pdf', 'jpg', 'png', 'docx', 'txt') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_invoice_state ON Invoice(state);
CREATE INDEX idx_invoice_creation_date ON Invoice(creation_date);
CREATE INDEX idx_invoice_expiration_date ON Invoice(expiration_date);
CREATE INDEX idx_client_email ON Client(email);
CREATE INDEX idx_item_name ON Item(name);
CREATE INDEX idx_invoice_number ON Invoice(invoice_number);

-- Triggers
DELIMITER //

-- Trigger for checking expiration_date is not earlier than creation_date
CREATE TRIGGER before_invoice_insert 
BEFORE INSERT ON Invoice
FOR EACH ROW 
BEGIN
    IF NEW.expiration_date < NEW.creation_date THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Expiration date cannot be earlier than creation date';
    END IF;
END//

-- Trigger for logging state changes into Invoice_History
CREATE TRIGGER after_invoice_state_change
AFTER UPDATE ON Invoice
FOR EACH ROW
BEGIN
    IF OLD.state != NEW.state THEN
        INSERT INTO Invoice_History (
            invoice_id,
            previous_state,
            new_state,
            changed_by_user_id
        ) VALUES (
            NEW.id,
            OLD.state,
            NEW.state,
            IFNULL(@current_user_id, NULL)
        );
    END IF;
END//

-- Trigger for logging INSERT into Invoice_Log when a new invoice is created
CREATE TRIGGER after_invoice_insert
AFTER INSERT ON Invoice
FOR EACH ROW
BEGIN
    INSERT INTO Invoice_Log (
        invoice_id,
        modification_type,
        new_value,
        modification_timestamp,
        changed_by_user_id,
        details
    ) VALUES (
        NEW.id,
        'create',
        CONCAT('Invoice created with number: ', NEW.invoice_number, ', total_amount: ', NEW.total_amount),
        CURRENT_TIMESTAMP,
        IFNULL(@current_user_id, NULL),
        'New invoice creation'
    );
END//

-- Trigger for logging UPDATE into Invoice_Log when an invoice is updated
CREATE TRIGGER after_invoice_update
AFTER UPDATE ON Invoice
FOR EACH ROW
BEGIN
    IF OLD.state != NEW.state OR OLD.total_amount != NEW.total_amount THEN
        INSERT INTO Invoice_Log (
            invoice_id,
            modification_type,
            old_value,
            new_value,
            modification_timestamp,
            changed_by_user_id,
            details
        ) VALUES (
            NEW.id,
            'update',
            CONCAT('Old state: ', OLD.state, ', Old total_amount: ', OLD.total_amount),
            CONCAT('New state: ', NEW.state, ', New total_amount: ', NEW.total_amount),
            CURRENT_TIMESTAMP,
            IFNULL(@current_user_id, NULL),
            'Invoice updated'
        );
    END IF;
END//

-- Trigger for logging DELETE into Invoice_Log when an invoice is deleted
CREATE TRIGGER after_invoice_delete
AFTER DELETE ON Invoice
FOR EACH ROW
BEGIN
    INSERT INTO Invoice_Log (
        invoice_id,
        modification_type,
        old_value,
        modification_timestamp,
        changed_by_user_id,
        details
    ) VALUES (
        OLD.id,
        'delete',
        CONCAT('Deleted invoice with number: ', OLD.invoice_number, ', total_amount: ', OLD.total_amount),
        CURRENT_TIMESTAMP,
        IFNULL(@current_user_id, NULL),
        'Invoice deletion'
    );
END//

-- Trigger for updating subtotal when an Invoice_Line is inserted
CREATE TRIGGER after_invoice_line_insert
AFTER INSERT ON Invoice_Line
FOR EACH ROW
BEGIN
    DECLARE new_subtotal DECIMAL(10, 2);
    SET new_subtotal = (SELECT COALESCE(SUM(quantity * price), 0)
                        FROM Invoice_Line
                        WHERE invoice_id = NEW.invoice_id);
    UPDATE Invoice
    SET subtotal = new_subtotal
    WHERE id = NEW.invoice_id;
END//

-- Trigger for updating subtotal when an Invoice_Line is updated
CREATE TRIGGER after_invoice_line_update
AFTER UPDATE ON Invoice_Line
FOR EACH ROW
BEGIN
    DECLARE new_subtotal DECIMAL(10, 2);
    SET new_subtotal = (SELECT COALESCE(SUM(quantity * price), 0)
                        FROM Invoice_Line
                        WHERE invoice_id = NEW.invoice_id);
    UPDATE Invoice
    SET subtotal = new_subtotal
    WHERE id = NEW.invoice_id;
END//

-- Trigger for updating subtotal when an Invoice_Line is deleted
CREATE TRIGGER after_invoice_line_delete
AFTER DELETE ON Invoice_Line
FOR EACH ROW
BEGIN
    DECLARE new_subtotal DECIMAL(10, 2);
    SET new_subtotal = (SELECT COALESCE(SUM(quantity * price), 0)
                        FROM Invoice_Line
                        WHERE invoice_id = OLD.invoice_id);
    UPDATE Invoice
    SET subtotal = new_subtotal
    WHERE id = OLD.invoice_id;
END//

-- Trigger for updating total_amount when an Invoice_Line is inserted
CREATE TRIGGER after_invoice_line_insert_total
AFTER INSERT ON Invoice_Line
FOR EACH ROW
BEGIN
    CALL update_total_amount(NEW.invoice_id);
END//

-- Trigger for updating total_amount when an Invoice_Line is updated
CREATE TRIGGER after_invoice_line_update_total
AFTER UPDATE ON Invoice_Line
FOR EACH ROW
BEGIN
    CALL update_total_amount(NEW.invoice_id);
END//

-- Trigger for updating total_amount when an Invoice_Line is deleted
CREATE TRIGGER after_invoice_line_delete_total
AFTER DELETE ON Invoice_Line
FOR EACH ROW
BEGIN
    CALL update_total_amount(OLD.invoice_id);
END//

-- Trigger for updating total_amount when a tax is applied or removed
CREATE TRIGGER after_invoice_tax_change
AFTER INSERT ON Invoice_Tax
FOR EACH ROW
BEGIN
    CALL update_total_amount(NEW.invoice_id);
END//

CREATE TRIGGER after_invoice_tax_delete
AFTER DELETE ON Invoice_Tax
FOR EACH ROW
BEGIN
    CALL update_total_amount(OLD.invoice_id);
END//

-- Trigger for updating total_amount when a discount is applied or removed
CREATE TRIGGER after_invoice_discount_change
AFTER INSERT ON Invoice_Discount
FOR EACH ROW
BEGIN
    CALL update_total_amount(NEW.invoice_id);
END//

CREATE TRIGGER after_invoice_discount_delete
AFTER DELETE ON Invoice_Discount
FOR EACH ROW
BEGIN
    CALL update_total_amount(OLD.invoice_id);
END//

-- Stored Procedure to update the total_amount
CREATE PROCEDURE update_total_amount(IN invoiceId INT UNSIGNED)
BEGIN
    DECLARE subtotal DECIMAL(10, 2);
    DECLARE total_tax_rate DECIMAL(8, 2);
    DECLARE total_discount DECIMAL(10, 2);

    -- Calculate the subtotal
    SET subtotal = (SELECT COALESCE(SUM(quantity * price), 0)
                    FROM Invoice_Line
                    WHERE invoice_id = invoiceId);

    -- Calculate the total tax rate (sum of applicable rates)
    SET total_tax_rate = (SELECT COALESCE(SUM(rate), 0)
                          FROM Tax t
                          INNER JOIN Invoice_Tax it ON t.id = it.tax_id
                          WHERE it.invoice_id = invoiceId);

    -- Calculate the total discount (sum of fixed discounts and percentage discounts)
    SET total_discount = (SELECT COALESCE(SUM(CASE 
        WHEN d.type = 'fixed' THEN d.value
        WHEN d.type = 'percentage' THEN (subtotal * d.value / 100)
        ELSE 0
    END), 0)
    FROM Discount d
    INNER JOIN Invoice_Discount id ON d.id = id.discount_id
    WHERE id.invoice_id = invoiceId);

    -- Calculate the final total_amount
    UPDATE Invoice
    SET total_amount = subtotal + (subtotal * total_tax_rate / 100) - total_discount
    WHERE id = invoiceId;
END//

DELIMITER ;
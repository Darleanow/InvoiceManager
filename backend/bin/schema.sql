  SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
  SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
  SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

  -- -----------------------------------------------------
  -- Schema invoice_manager
  -- -----------------------------------------------------
  CREATE SCHEMA IF NOT EXISTS `invoice_manager` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
  USE `invoice_manager`;

  -- -----------------------------------------------------
  -- Table `invoice_manager`.`benefit`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `invoice_manager`.`benefit`;

  CREATE TABLE IF NOT EXISTS `invoice_manager`.`benefit` (
      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `object` VARCHAR(255) NOT NULL,
      `unit` BIGINT NOT NULL,
      `price_per_unit` INT NOT NULL,
      PRIMARY KEY (`id`)
  ) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

  -- -----------------------------------------------------
  -- Table `invoice_manager`.`customer`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `invoice_manager`.`customer`;

  CREATE TABLE IF NOT EXISTS `invoice_manager`.`customer` (
      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `name` VARCHAR(50) NOT NULL,
      `email` VARCHAR(50) NOT NULL,
      `postal_address` VARCHAR(100) NOT NULL,
      PRIMARY KEY (`id`)
  ) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

  -- -----------------------------------------------------
  -- Table `invoice_manager`.`customer_invoice`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `invoice_manager`.`customer_invoice`;

  CREATE TABLE IF NOT EXISTS `invoice_manager`.`customer_invoice` (
      `customer_invoice_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `customer_id` BIGINT UNSIGNED NOT NULL,
      `invoice_id` BIGINT UNSIGNED NOT NULL,
      PRIMARY KEY (`customer_invoice_id`),
      INDEX `idx_customer_id` (`customer_id` ASC),
      INDEX `idx_invoice_id` (`invoice_id` ASC),
      CONSTRAINT `fk_customer_invoice_customer_id`
        FOREIGN KEY (`customer_id`)
        REFERENCES `invoice_manager`.`customer` (`id`)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
      CONSTRAINT `fk_customer_invoice_invoice_id`
        FOREIGN KEY (`invoice_id`)
        REFERENCES `invoice_manager`.`invoice` (`id`)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
  ) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

  -- -----------------------------------------------------
  -- Table `invoice_manager`.`invoice`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `invoice_manager`.`invoice`;

  CREATE TABLE IF NOT EXISTS `invoice_manager`.`invoice` (
      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `name` VARCHAR(50) NOT NULL,
      `date` DATE NOT NULL,
      PRIMARY KEY (`id`)
  ) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

  -- -----------------------------------------------------
  -- Table `invoice_manager`.`invoice_benefit`
  -- -----------------------------------------------------
  DROP TABLE IF EXISTS `invoice_manager`.`invoice_benefit`;

  CREATE TABLE IF NOT EXISTS `invoice_manager`.`invoice_benefit` (
      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `invoice_id` BIGINT UNSIGNED NOT NULL,
      `benefit_id` BIGINT UNSIGNED NOT NULL,
      PRIMARY KEY (`id`),
      INDEX `idx_invoice_id` (`invoice_id` ASC),
      INDEX `idx_benefit_id` (`benefit_id` ASC),
      CONSTRAINT `fk_invoice_benefit_invoice_id`
        FOREIGN KEY (`invoice_id`)
        REFERENCES `invoice_manager`.`invoice` (`id`)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
      CONSTRAINT `fk_invoice_benefit_benefit_id`
        FOREIGN KEY (`benefit_id`)
        REFERENCES `invoice_manager`.`benefit` (`id`)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
  ) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

  SET SQL_MODE=@OLD_SQL_MODE;
  SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
  SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

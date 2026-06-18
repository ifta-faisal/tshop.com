-- ============================================================
-- RoboXpressBD – Database Schema & Seed Data
-- Engine: MySQL 8.x  |  Charset: utf8mb4  |  Collation: utf8mb4_unicode_ci
-- Usage:  mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS `roboxpressbd`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE `roboxpressbd`;

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`           BIGINT       NOT NULL AUTO_INCREMENT,
  `name`         VARCHAR(150) NOT NULL,
  `slug`         VARCHAR(160) NOT NULL,
  `image_url`    VARCHAR(500) DEFAULT NULL,
  `description`  TEXT         DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_category_slug` (`slug`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `brands` (
  `id`        BIGINT       NOT NULL AUTO_INCREMENT,
  `name`      VARCHAR(150) NOT NULL,
  `slug`      VARCHAR(160) NOT NULL,
  `logo_url`  VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_brand_slug` (`slug`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `products` (
  `id`             BIGINT         NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(255)   NOT NULL,
  `slug`           VARCHAR(280)   NOT NULL,
  `description`    TEXT           DEFAULT NULL,
  `specifications` TEXT           DEFAULT NULL,
  `price`          DECIMAL(12, 2) NOT NULL,
  `old_price`      DECIMAL(12, 2) DEFAULT NULL,
  `stock`          INT            NOT NULL DEFAULT 0,
  `image_url`      VARCHAR(500)   DEFAULT NULL,
  `sku`            VARCHAR(80)    DEFAULT NULL,
  `active`         TINYINT(1)     NOT NULL DEFAULT 1,
  `featured`       TINYINT(1)     NOT NULL DEFAULT 0,
  `new_arrival`    TINYINT(1)     NOT NULL DEFAULT 0,
  `trending`       TINYINT(1)     NOT NULL DEFAULT 0,
  `back_in_stock`  TINYINT(1)     NOT NULL DEFAULT 0,
  `category_id`    BIGINT         DEFAULT NULL,
  `brand_id`       BIGINT         DEFAULT NULL,
  `created_at`     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_slug` (`slug`),
  KEY `idx_product_category` (`category_id`),
  KEY `idx_product_brand` (`brand_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_brand`    FOREIGN KEY (`brand_id`)    REFERENCES `brands`(`id`)    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `banners` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(200) DEFAULT NULL,
  `image_url`   VARCHAR(500) NOT NULL,
  `link_url`    VARCHAR(500) DEFAULT NULL,
  `placement`   VARCHAR(40)  NOT NULL DEFAULT 'HERO',
  `active`      TINYINT(1)   NOT NULL DEFAULT 1,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `users` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT,
  `full_name`  VARCHAR(150) NOT NULL,
  `email`      VARCHAR(190) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `phone`      VARCHAR(40)  DEFAULT NULL,
  `address`    VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` BIGINT       NOT NULL,
  `role`    VARCHAR(40)  NOT NULL,
  PRIMARY KEY (`user_id`, `role`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id`          BIGINT NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT NOT NULL,
  `product_id`  BIGINT NOT NULL,
  `quantity`    INT    NOT NULL DEFAULT 1,
  `added_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cart_user_product` (`user_id`, `product_id`),
  CONSTRAINT `fk_cart_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `orders` (
  `id`                BIGINT         NOT NULL AUTO_INCREMENT,
  `order_number`      VARCHAR(40)    NOT NULL,
  `user_id`           BIGINT         NOT NULL,
  `customer_name`     VARCHAR(150)   NOT NULL,
  `customer_email`    VARCHAR(190)   DEFAULT NULL,
  `customer_phone`    VARCHAR(40)    NOT NULL,
  `shipping_address`  VARCHAR(500)   NOT NULL,
  `total_amount`      DECIMAL(12, 2) NOT NULL,
  `status`            VARCHAR(40)    NOT NULL DEFAULT 'PENDING',
  `payment_method`    VARCHAR(40)    NOT NULL DEFAULT 'COD',
  `created_at`        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_number` (`order_number`),
  KEY `idx_order_user` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `order_items` (
  `id`            BIGINT         NOT NULL AUTO_INCREMENT,
  `order_id`      BIGINT         NOT NULL,
  `product_id`    BIGINT         DEFAULT NULL,
  `product_name`  VARCHAR(255)   NOT NULL,
  `product_slug`  VARCHAR(280)   DEFAULT NULL,
  `product_image` VARCHAR(500)   DEFAULT NULL,
  `unit_price`    DECIMAL(12, 2) NOT NULL,
  `quantity`      INT            NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_item_order` (`order_id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Seed: Categories
-- ------------------------------------------------------------
INSERT INTO `categories` (`name`, `slug`, `description`) VALUES
 ('Arduino & Compatible',  'arduino',        'Boards, shields, modules, and accessories for the Arduino ecosystem.'),
 ('Raspberry Pi',          'raspberry-pi',   'Single-board computers, cases, accessories, and HATs.'),
 ('Sensors',               'sensors',        'Temperature, humidity, motion, gas, ultrasonic, IR and more.'),
 ('Motors & Actuators',    'motors',         'DC, stepper, servo, drivers and gear motors.'),
 ('Modules',               'modules',        'Wireless, relay, power, display and communication modules.'),
 ('Tools & Equipment',     'tools',          'Soldering, multimeters, hand tools, and lab equipment.'),
 ('Robotics & Kits',       'robotics-kits',  'DIY robot kits, car chassis, arms, drones, and STEM kits.'),
 ('Power & Batteries',     'power',          'Battery packs, chargers, power supplies, and solar.'),
 ('Cables & Connectors',   'cables',         'Jumper wires, USB, HDMI, and specialty connectors.'),
 ('PCB & Components',      'pcb',            'Breadboards, prototype PCBs, resistors, capacitors, ICs.');

-- ------------------------------------------------------------
-- Seed: Brands
-- ------------------------------------------------------------
INSERT INTO `brands` (`name`, `slug`) VALUES
 ('Arduino',           'arduino'),
 ('Raspberry Pi',      'raspberry-pi'),
 ('Espressif',         'espressif'),
 ('STMicroelectronics','stmicroelectronics'),
 ('Texas Instruments', 'texas-instruments'),
 ('DFRobot',           'dfrobot'),
 ('SparkFun',          'sparkfun'),
 ('Adafruit',          'adafruit'),
 ('Pololu',            'pololu'),
 ('Seeed Studio',      'seeed-studio');

-- ------------------------------------------------------------
-- Seed: Banners
-- ------------------------------------------------------------
INSERT INTO `banners` (`title`, `image_url`, `link_url`, `placement`, `active`, `sort_order`) VALUES
 ('Robotics Mega Sale',         'https://placehold.co/1200x400/0f9d58/ffffff?text=Robotics+Mega+Sale',     '/products?sort=newest', 'HERO',      1, 1),
 ('New Raspberry Pi 5 In Stock', 'https://placehold.co/1200x400/0b7a45/ffffff?text=Raspberry+Pi+5',     '/products?category=raspberry-pi', 'HERO', 1, 2),
 ('Arduino Day Offers',         'https://placehold.co/1200x400/0f9d58/ffffff?text=Arduino+Day+Offers', '/products?category=arduino', 'HERO', 1, 3),
 ('Sensors Under ৳500',         'https://placehold.co/1200x400/0b7a45/ffffff?text=Sensors+Under+500',    '/products?category=sensors', 'PROMOTION', 1, 4);

-- ------------------------------------------------------------
-- Seed: Products
-- ------------------------------------------------------------
INSERT INTO `products` (`name`, `slug`, `description`, `price`, `old_price`, `stock`, `image_url`, `sku`, `active`, `featured`, `new_arrival`, `trending`, `back_in_stock`, `category_id`, `brand_id`) VALUES
 ('Arduino Uno R3 (CH340)', 'arduino-uno-r3-ch340', 'Classic Arduino-compatible board with CH340 USB chip. Perfect for beginners and education.', 650.00, 750.00, 120, 'https://placehold.co/500x500/0f9d58/ffffff?text=Arduino+Uno', 'RX-ARD-UNO3', 1, 1, 0, 1, 0, 1, 1),
 ('Arduino Mega 2560 R3',  'arduino-mega-2560-r3', 'More I/O pins and memory for ambitious projects.', 1450.00, 1700.00, 40, 'https://placehold.co/500x500/0f9d58/ffffff?text=Mega+2560', 'RX-ARD-MEGA', 1, 1, 0, 0, 0, 1, 1),
 ('Raspberry Pi 5 8GB',    'raspberry-pi-5-8gb',  'Latest flagship SBC with 8GB RAM, dual 4K HDMI, PCIe 2.0.', 13500.00, 14500.00, 8, 'https://placehold.co/500x500/0b7a45/ffffff?text=Pi+5+8GB', 'RX-RPI-5-8G', 1, 1, 1, 1, 0, 2, 2),
 ('Raspberry Pi 4 Model B 4GB', 'raspberry-pi-4-4gb', 'Powerful 4GB SBC with dual micro-HDMI.', 7800.00, 8200.00, 15, 'https://placehold.co/500x500/0b7a45/ffffff?text=Pi+4+4GB', 'RX-RPI-4-4G', 1, 0, 0, 0, 1, 2, 2),
 ('ESP32 DevKit V1',       'esp32-devkit-v1',     'Dual-core Wi-Fi + Bluetooth MCU module.', 520.00, 600.00, 90, 'https://placehold.co/500x500/0f9d58/ffffff?text=ESP32', 'RX-ESP32-DK1', 1, 1, 1, 1, 0, 5, 3),
 ('NodeMCU V3 (ESP8266)',  'nodemcu-v3-esp8266',  'Wi-Fi enabled microcontroller board.', 380.00, 450.00, 110, 'https://placehold.co/500x500/0f9d58/ffffff?text=NodeMCU', 'RX-ESP8266-N3', 1, 0, 0, 1, 0, 5, 3),
 ('DHT22 Temperature & Humidity Sensor', 'dht22-temp-humidity', 'High-precision digital temp/humidity sensor.', 280.00, 350.00, 200, 'https://placehold.co/500x500/0b7a45/ffffff?text=DHT22', 'RX-SEN-DHT22', 1, 1, 0, 0, 0, 3, 6),
 ('HC-SR04 Ultrasonic Sensor', 'hc-sr04-ultrasonic', '2cm-400cm range ultrasonic distance sensor.', 110.00, 150.00, 300, 'https://placehold.co/500x500/0b7a45/ffffff?text=HC-SR04', 'RX-SEN-HCSR04', 1, 0, 0, 1, 0, 3, 6),
 ('SG90 Micro Servo Motor', 'sg90-micro-servo',   '9g micro servo, 180° rotation.', 120.00, 180.00, 250, 'https://placehold.co/500x500/0f9d58/ffffff?text=SG90', 'RX-MOT-SG90', 1, 0, 0, 1, 0, 4, 8),
 ('L298N Dual H-Bridge Motor Driver', 'l298n-motor-driver', 'Drive two DC motors or one stepper.', 180.00, 220.00, 180, 'https://placehold.co/500x500/0f9d58/ffffff?text=L298N', 'RX-MOT-L298N', 1, 0, 0, 0, 0, 4, 8),
 ('16x2 LCD with I2C Module', 'lcd-16x2-i2c',    'Character LCD with I2C backpack, 4 lines saved.', 230.00, 300.00, 130, 'https://placehold.co/500x500/0b7a45/ffffff?text=LCD+16x2', 'RX-MOD-LCD16', 1, 0, 0, 0, 0, 5, 7),
 ('Breadboard 830 Tie-Points', 'breadboard-830', 'Solderless prototyping breadboard.', 95.00, 130.00, 400, 'https://placehold.co/500x500/0b7a45/ffffff?text=Breadboard', 'RX-PCB-BB830', 1, 0, 0, 0, 1, 10, 6),
 ('65pcs Jumper Wires Kit',  'jumper-wires-65',   'Mixed-length male-male, male-female, female-female.', 180.00, 220.00, 350, 'https://placehold.co/500x500/0f9d58/ffffff?text=Wires', 'RX-CBL-JMP65', 1, 0, 0, 0, 0, 9, 6),
 ('4WD Robot Car Chassis Kit', '4wd-robot-chassis', 'Acrylic chassis with 4 DC motors and wheels.', 980.00, 1200.00, 25, 'https://placehold.co/500x500/0f9d58/ffffff?text=4WD+Chassis', 'RX-RBT-4WD', 1, 1, 1, 1, 0, 7, 9),
 ('Soldering Iron 60W (Adjustable)', 'soldering-iron-60w', 'Temperature-adjustable soldering iron, 200-450°C.', 750.00, 900.00, 70, 'https://placehold.co/500x500/0b7a45/ffffff?text=Soldering', 'RX-TOL-IRON60', 1, 0, 0, 0, 0, 6, 7),
 ('Digital Multimeter DT-830B', 'multimeter-dt830b', 'Basic pocket digital multimeter.', 480.00, 600.00, 90, 'https://placehold.co/500x500/0b7a45/ffffff?text=Multimeter', 'RX-TOL-DT830', 1, 0, 0, 0, 1, 6, 7),
 ('18650 Battery 3.7V 2600mAh', 'battery-18650-2600', 'Rechargeable Li-ion 18650 cell.', 220.00, 280.00, 240, 'https://placehold.co/500x500/0f9d58/ffffff?text=18650', 'RX-PWR-18650', 1, 0, 0, 0, 0, 8, 8),
 ('MB102 Breadboard Power Supply 3.3V/5V', 'mb102-power-supply', 'Adjustable 3.3V/5V power module for breadboards.', 240.00, 300.00, 150, 'https://placehold.co/500x500/0b7a45/ffffff?text=MB102', 'RX-PWR-MB102', 1, 0, 0, 0, 0, 8, 6),
 ('IR Obstacle Avoidance Sensor', 'ir-obstacle-sensor', '3-wire IR reflective sensor module.', 90.00, 130.00, 220, 'https://placehold.co/500x500/0f9d58/ffffff?text=IR+Sensor', 'RX-SEN-IR', 1, 0, 1, 0, 0, 3, 8),
 ('OLED Display 0.96" I2C (Blue)', 'oled-0-96-blue', '128x64 OLED display, I2C, blue.', 320.00, 400.00, 140, 'https://placehold.co/500x500/0b7a45/ffffff?text=OLED', 'RX-MOD-OLED96', 1, 1, 1, 0, 0, 5, 8);

-- ------------------------------------------------------------
-- Seed: Demo admin user
-- Password: admin123  (BCrypt hash, strength 10)
-- IMPORTANT: change immediately in production.
-- ------------------------------------------------------------
INSERT INTO `users` (`full_name`, `email`, `password`, `phone`, `address`) VALUES
 ('Site Admin', 'admin@roboxpressbd.com',
  '$2a$10$2.Z1u/4w0lWqf2H5uV5q4OqJpM0yZ3V9zV.4qi9YjxqfJxk7GZ3L2',
  '+8801700000000', 'Dhaka, Bangladesh');
SET @admin_id := LAST_INSERT_ID();
INSERT INTO `user_roles` (`user_id`, `role`) VALUES (@admin_id, 'ROLE_USER'), (@admin_id, 'ROLE_ADMIN');

-- A regular demo customer (password: demo1234)
INSERT INTO `users` (`full_name`, `email`, `password`, `phone`, `address`) VALUES
 ('Demo Customer', 'demo@roboxpressbd.com',
  '$2a$10$2.Z1u/4w0lWqf2H5uV5q4OqJpM0yZ3V9zV.4qi9YjxqfJxk7GZ3L2',
  '+8801711111111', 'Mirpur, Dhaka');
SET @demo_id := LAST_INSERT_ID();
INSERT INTO `user_roles` (`user_id`, `role`) VALUES (@demo_id, 'ROLE_USER');

-- ============================================================
-- End of schema.sql
-- Re-run BCrypt for real passwords by hitting POST /api/auth/signup
-- or by running BCryptPasswordEncoder from a small Java snippet.
-- ============================================================

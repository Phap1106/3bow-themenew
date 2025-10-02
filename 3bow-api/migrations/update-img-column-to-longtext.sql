-- Migration: Update img column to longtext to support base64 images
-- Date: 2025-10-02

USE threebow;

-- Update img column from varchar(500) to longtext
ALTER TABLE users MODIFY COLUMN img LONGTEXT NULL;

-- Verify the change
DESCRIBE users;

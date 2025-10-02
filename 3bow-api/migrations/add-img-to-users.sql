-- Migration: Add img field to users table
-- Date: 2024-10-02
-- Description: Add avatar image field to users table for profile management

ALTER TABLE `users` 
ADD COLUMN `img` VARCHAR(500) NULL COMMENT 'Avatar image URL or path' 
AFTER `address`;

-- Optional: Add index for faster queries if needed
-- CREATE INDEX idx_users_img ON users(img);

-- Update existing users with default avatar (optional)
-- UPDATE `users` SET `img` = '/default-avatar.png' WHERE `img` IS NULL;

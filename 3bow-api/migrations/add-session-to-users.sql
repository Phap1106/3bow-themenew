-- Migration: Add session field to users table
-- Date: 2024-10-02
-- Description: Add session field to track user login sessions

ALTER TABLE `users` 
ADD COLUMN `session` VARCHAR(500) NULL COMMENT 'User session token' 
AFTER `sessionVersion`;

-- Add index for session lookup performance
CREATE INDEX `idx_users_session` ON `users` (`session`);

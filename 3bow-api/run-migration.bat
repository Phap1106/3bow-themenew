@echo off
echo Running migration to update img column...
mysql -u root -p threebow -e "ALTER TABLE users MODIFY COLUMN img LONGTEXT NULL;"
echo Migration completed!
pause

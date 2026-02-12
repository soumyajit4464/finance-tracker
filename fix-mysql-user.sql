-- Run these commands in MySQL to fix the authentication issue

-- Connect to MySQL as root first: mysql -u root -p
-- Then run these commands:

DROP USER IF EXISTS 'financeuser'@'localhost';

CREATE USER 'financeuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password123';

GRANT ALL PRIVILEGES ON finance_tracker.* TO 'financeuser'@'localhost';

FLUSH PRIVILEGES;

-- Test the connection
SELECT User, Host, plugin FROM mysql.user WHERE User = 'financeuser';

-- You should see: financeuser | localhost | mysql_native_password

EXIT;

USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE reactivateCustomerAccount(@email VARCHAR(255))
AS
BEGIN
    UPDATE users SET is_deleted = 0 WHERE email = @email AND is_admin = 0
END
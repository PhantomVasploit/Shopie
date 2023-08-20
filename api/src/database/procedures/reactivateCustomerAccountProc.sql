USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE reactivateCustomerAccount(@id INT)
AS
BEGIN
    UPDATE users SET is_deleted = 0 WHERE id = @id AND is_admin = 0
END
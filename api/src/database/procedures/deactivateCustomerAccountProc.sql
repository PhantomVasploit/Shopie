USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE deactivateCustomerAccount(@id INT)
AS
BEGIN
    UPDATE users SET is_deleted = 1 WHERE id = @id AND is_admin = 0
END
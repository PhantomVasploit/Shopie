USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE deleteCustomerProc(@id INT)
AS
BEGIN
    UPDATE users SET is_deleted = 1 WHERE id = @id AND is_admin = 0
END
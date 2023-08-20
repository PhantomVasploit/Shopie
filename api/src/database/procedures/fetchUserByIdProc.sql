USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE fetchCustomerById(@id INT)
AS
BEGIN
    SELECT * FROM users WHERE id = @id AND is_admin = 0
END
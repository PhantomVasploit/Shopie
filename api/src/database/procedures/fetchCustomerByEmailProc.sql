USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE fetchCustomerByEmailProc(@email VARCHAR(255))
AS
BEGIN
    SELECT * FROM users WHERE email = @email
END
GO
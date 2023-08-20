USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE fetchAllCustomersProc
AS
BEGIN
    SELECT * FROM users WHERE is_admin = 0
END
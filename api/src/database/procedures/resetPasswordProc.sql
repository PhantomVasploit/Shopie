USE ShopieDatabase
GO


CREATE OR ALTER PROCEDURE resetPasswordProc(@passowrd VARCHAR(MAX), @email VARCHAR(255))
AS
BEGIN
    UPDATE users SET passowrd = @passowrd, password_reset_token = NULL, password_reset_expiration = NULL WHERE email = @email
END
USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE resetPasswordProc(@email VARCHAR(255), @password_reset_token VARCHAR(255), @password_reset_expiration DATETIME)
AS
BEGIN
    UPDATE users SET password_reset_token = @password_reset_token, password_reset_expiration=@password_reset_expiration  WHERE email = @id
END
GO
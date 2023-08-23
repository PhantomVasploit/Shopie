USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE resetPasswordProc(@email VARCHAR(255), @password_reset_token VARCHAR(255))
AS
BEGIN
    UPDATE users SET password_reset_token = @password_reset_token, password_reset_expiration=DATEADD(HOUR, 1, GETDATE())  WHERE email = @email
END
GO
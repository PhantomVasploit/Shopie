USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE updateUserProc(@id INT, @first_name VARCHAR(255), @last_name VARCHAR(255), @email VARCHAR(255), @phone_number VARCHAR(255), @profile_picture VARCHAR(255))
AS
BEGIN
    UPDATE users SET first_name = @first_name, last_name = @last_name, email = @email, phone_number = @phone_number, profile_picture = @profile_picture WHERE id = @id
END
GO
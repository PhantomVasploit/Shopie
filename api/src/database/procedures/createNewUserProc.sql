USE ShopieDatabase
GO

CREATE OR ALTER PROCEDURE createNewUserProc(@first_name VARCHAR(255), @last_name VARCHAR(255), @email VARCHAR(255), @phone_number VARCHAR(255), @profile_picture VARCHAR(255), @passowrd VARCHAR(MAX))
AS
BEGIN
    INSERT INTO users(first_name, last_name, email, phone_number, profile_picture, passowrd)
    VALUES(@first_name, @last_name, @email, @phone_number, @profile_picture, @passowrd)
END
GO
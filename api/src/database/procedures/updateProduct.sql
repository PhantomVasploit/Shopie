USE ShopieDatabase
GO


CREATE OR ALTER PROCEDURE updateProject (@id VARCHAR(200), @product_name  VARCHAR(500), @image VARCHAR(500) , @category VARCHAR(500), @description VARCHAR(1000), @price INT)
AS 
BEGIN
UPDATE Products SET product_name = @product_name, image = @image , category = @category, description = @description, price = @price   WHERE id = @id
END
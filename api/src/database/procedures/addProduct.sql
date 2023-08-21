USE ShopieDatabase
GO


CREATE OR ALTER PROCEDURE addProduct(@id VARCHAR(200), @product_name  VARCHAR(500), @image VARCHAR(500) , @category VARCHAR(500), @description VARCHAR(1000), @price INT)
AS
BEGIN
    INSERT INTO Products(id, product_name, image, category,description,price) VALUES (@id, @product_name , @image,@category, @description, @price)
END
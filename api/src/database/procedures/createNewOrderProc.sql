USE ShopieDatabase
GO


CREATE OR ALTER PROCEDURE createNewOrderProc(@customer_id INT, @product_id VARCHAR(200), @quantity INT)
AS
BEGIN

    INSERT INTO orders (customer_id, product_id, quantity)
    VALUES(@customer_id, @product_id, @quantity)

    UPDATE Products
    SET quantity = quantity - @quantity
    WHERE id = @product_id

END
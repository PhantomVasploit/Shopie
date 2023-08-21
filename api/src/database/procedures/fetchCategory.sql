USE ShopieDatabase
GO


CREATE OR ALTER PROCEDURE fetchCategory (@category VARCHAR(200))
AS  
    BEGIN 
        SELECT * FROM Products WHERE category = @category
    END
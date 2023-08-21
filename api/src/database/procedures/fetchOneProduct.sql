USE ShopieDatabase
GO


CREATE OR ALTER PROCEDURE fetchOneProduct (@id VARCHAR(200))
AS  
    BEGIN 
        SELECT * FROM Products WHERE id = @id
    END
USE ShopieDatabase
GO


CREATE OR ALTER PROCEDURE deleteProduct (@id VARCHAR(200))
AS
BEGIN 
    DELETE FROM Products WHERE id=@id
END


-- SELECT * FROM Products
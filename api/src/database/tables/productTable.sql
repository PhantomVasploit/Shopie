USE ShopieDatabase
GO

-- DROP TABLE Products


BEGIN 
    TRY
        CREATE TABLE Products(
            id VARCHAR(200) PRIMARY KEY,
            product_name VARCHAR(500) NOT NULL,
            image VARCHAR(500) NOT NULL,
            category VARCHAR(500) NOT NULL,
            description VARCHAR(1000) NOT NULL,
            price INT NOT NULL,
            quantity INT NOT NULL
        )
    END TRY
BEGIN   
    CATCH
        THROW 50001, 'Table already Exists!', 1;
    END CATCH



Drop Table Products
-- SELECT * FROM Products
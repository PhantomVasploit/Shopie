USE ShopieDatabase
GO

DROP TABLE orders

CREATE TABLE orders(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    is_paid BIT DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
)
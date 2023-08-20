USE ShopieDatabase
GO

CREATE TABLE users(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(255) UNIQUE NOT NULL,
    profile_picture VARCHAR(255) NOT NULL,
    passowrd VARCHAR(MAX) NOT NULL,
    is_verified BIT DEFAULT 0,
    is_admin BIT DEFAULT 0,
    is_deleted BIT DEFAULT 0
)
GO

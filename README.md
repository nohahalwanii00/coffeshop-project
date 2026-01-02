# coffeshop-project
This project is the backend API for a coffee shop website. It handles authentication, menu management, cart, tables (drag & edit), and dashboard access. The backend is built first, then connected to a frontend (React).



Backend: Node.js + Express + MySQL
Database: MySQL (XAMPP)
 The server will start on `http://localhost:5004`.
 
The app supports:
-User login / authentication
-Viewing menu
-Adding items to cart
-Cart management
-Tables layout with drag & edit for admin
-Admin dashboard to manage products and tables


Configure Environment Variables:
    The project is already set up with a `.env` file. Ensure it contains the following:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=
    DB_NAME=coffeeshop
    JWT_SECRET=mycoffeeShopSecretKey123!
    PORT=5004
  
    sql
    CREATE DATABASE coffeeshop;
    
 CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(100),
  
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(6,2),
  image VARCHAR(255)
);

CREATE TABLE carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT
);

CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(6,2)
);

CREATE TABLE tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number INT,
  x INT,
  y INT
);


-- Products 

   **GET** `/products` - Get all products.
   **POST** `/products` - Add a new product.
   **PUT** `/products/:id` - Update a product.
  **DELETE** `/products/:id` - Delete a product.

--Cart 

  **POST** `/cart` - Create a new cart for a user.
   **POST** `/cart/add` - Add an item to the cart.
   **GET** `/cart/:id` - Get items in a specific cart.

-- Tables 

   **GET** `/tables` - Get all tables.
   **POST** `/tables` - Add a new table.
   **PUT** `/tables/:id` - Update table position (x, y).
  **DELETE** `/tables/:id` - Delete a table.

--
 `express`: Web framework for Node.js.
 `mysql`: MySQL driver for Node.js.
 `jsonwebtoken`: For generating and verifying access tokens.
 `bcrypt`: For hashing and verifying passwords.
 `dotenv`: For loading environment variables.


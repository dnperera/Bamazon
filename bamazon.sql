DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name  VARCHAR(150) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);


-- ### Alternative way to insert more than one row
INSERT INTO products (product_name,department_name, price, stock_quantity)
VALUES ("Samsung Galaxy Tab E Lite 7", "Computers & Electronics", 99.90,20), 
("Apple MacBook Pro 15-inch Laptop with Touch Bar","Computers & Electronics",1899.90, 15),
("Samsung Electronics 65-Inch 4K Ultra HD Smart LED TV ", "Computers & Electronics", 1700.00,20),
("Horizon Organic Whole Milk Gallon","Food & Grocery",6.90, 25),
("Organic Valley,Organic Free-Range Large Eggs, 12 ct","Food & Grocery",5.25,30),
("Apple MacBook Pro 15-inch Laptop with Touch Bar","Computers & Electronics",1899.90, 15), 
("Almond Breeze, Unsweetened Vanilla, Half Gallon","Food & Grocery",3.90, 25),
("Dsquared2 Mens Distressed Blue Slim Leg Jeans","Clothing & Accessory",169.90, 35),
("Cheerios Gluten Free Breakfast Cereal","Food & Grocery",3.50, 20),
("DFarah Waithe Slim LS BD Shirt","Clothing & Accessory",107.90, 10),
("Coleman WeatherMaster 6-Person Screened Tent","Sports & Outdoor",140.90, 14),
("CamelBak 2017 HydroBak Hydration Pack","Sports & Outdoor",49.90, 18),
("Mobil 1 Synthetic Motor Oil 5W-30,5 Quart","Automotive Parts & Accessories",24.90, 22),
("The Great Wall","Movies & Games",14.90, 24),
("The Boss Baby","Movies & Games",19.90, 10),
("Genuine Toyota Air Filter Element","Automotive Parts & Accessories",20.90, 20);


var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "dphp94903",
  database: "bamazon"
});

connection.connect(function(err) {
  	if (err) throw err;
  	console.log("connected as id " + connection.threadId);
 	
 	displayInventory();
 	buyItems();
});


function displayInventory(){

	connection.query("SELECT * FROM products", function(err, res) {
		if(err) throw err;

		var table = new Table({
		    head: ['Prodcut ID', 'Product Name','Department','Unit Price','Quantity in Stock']
		  
		});

		for (var i = 0; i < res.length; i++) {
			//console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price +" | "+res[i].stock_quantity);
			var availQuant ="";
			
			if(res[i].stock_quantity === 0){

				availQuant = "Out of stock";
			}
			else{
				availQuant = res[i].stock_quantity;
			}

			table.push([res[i].item_id,
				res[i].product_name,
				res[i].department_name,
				res[i].price,
				availQuant]);
		}

		console.log(table.toString());
	
	});
	//connection.end();
	
}

function buyItems() {
	
	inquirer.prompt([
	  {
	    name: "productID",
	    message: "Enter the Product ID that you wish to buy ?"
	  }, {
	    name: "quantity",
	    message: "How many units of the item you like to buy ?"
	  }
	]).then(function(answers) {

		var productID = answers['productID'].trim();
		var quantity = answers['quantity'].trim();

		//get the current stock details from the DB of the selected item
		connection.query("SELECT * FROM products WHERE ?",{ item_id:productID}, function(err, res) {
		if(err) throw err;
			
			if(res[0].stock_quantity >= quantity ){
				var Total = res[0].price*quantity;
				var name = res[0].product_name;

				var currentStock = res[0].stock_quantity - quantity;

				//update the db with current stock value;
				connection.query(
				  "UPDATE products SET ? WHERE ?",
				  [
				    {
				      stock_quantity:currentStock
				    },
				    {
				      item_id:productID
				    }
				  ],
				  function(err, res) {
				  	
				  	if(err) throw err;

				    console.log("--------------- Invoice ----------------- \n");
				    console.log("Product Name : "+name+"\n");
				    console.log("Number of Items : "+quantity+"\n");
				    console.log("Grand Total : $"+Total.toFixed(2)+"\n");
				    console.log("--------------------------------------- \n");

				    // Call deleteProduct AFTER the UPDATE completes
				     displayInventory();
				     connection.end();
				  }
				);

			}
			else {
				console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n");
				console.log('Insufficient quantity in stock !\n');
				console.log('Try to lower the quantity or try different product.!\n');
				console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n");

				buyItems();
			}
		});
	});
}



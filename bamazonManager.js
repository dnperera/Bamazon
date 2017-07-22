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
  	//console.log("connected as id " + connection.threadId);

});

function displayInventory(type){
	var searchQuery ="";
	if(type ==="full"){
		searchQuery = "SELECT * FROM products";
	}
	else{
		searchQuery = "SELECT * FROM products WHERE stock_quantity <=5";
	}

	connection.query(searchQuery, function(err, res) {
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
	connection.end();
	
}

function updateInventory(){
	console.log("---------------- Update Stock In Hand For A Selected Product -------------\n")
	inquirer.prompt([
	  {
	    name: "productID",
	    message: "Enter the Product ID that you wish to update ?"
	  }, {
	    name: "quantity",
	    message: "Enter the new total of items in stock "
	  }
	]).then(function(answers) {

		var productID = answers['productID'].trim();
		var quantity = answers['quantity'].trim();

		//update the db with current stock value;
		connection.query(
		  "UPDATE products SET ? WHERE ?",
		  [
		    {
		      stock_quantity:quantity
		    },
		    {
		      item_id:productID
		    }
		  ],
		  function(err, res) {

		  	if(err) throw err;
		  	console.log(res.affectedRows + " Product quantity in stock updated!\n");
		  	displayInventory("full");
		  });

	});
}

function addNewProduct(){
	console.log("---------------- Add New Product To The Inventory -------------\n");
	inquirer.prompt([
	  {
	    name: "product_name",
	    message: "Enter the Product Name that you wish to Add.\n"
	  }, {
	    name: "department_name",
	    message: "Enter Department Name of the product.\n"
	  },
	  {
	  	name: "price",
	  	message: "Enter the selling price of the product.\n"
	  },
  	  {
  	  	name: "stock_quantity",
  	  	message: "Enter the total product quantity in stock.\n"
  	  }
	]).then(function(answers) {

	var query = connection.query(
		  "INSERT INTO products SET ?",
		  {
		    product_name:answers['product_name'].trim(),
		    department_name:answers['department_name'].trim(),
		    price:parseFloat(answers['price'].trim()),
		    stock_quantity:parseInt(answers['stock_quantity'].trim())
		  },
		  function(err, res) {
		    console.log(answers['product_name'] + " was added to the Inventory.\n");
		    displayInventory("full");
		});
	});
}


inquirer.prompt([
	{
	  type: "list",
	  message: "------------- Welcome to The Bamazon BackEnd Module -----------------------\n"+
	  		"Please select one of the options bellow using arrow keys\n "+
	  		"and then press enter to continue !.\n",
	  choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product","Exit"],
	  name: "userRequest"
	}

]).then(function(inquirerRes) {
	//console.log(inquirerRes.userRequest);

	switch(inquirerRes.userRequest){
		case "View Products for Sale" :
			displayInventory("full");
			break;

		case "View Low Inventory" :
			displayInventory("low");
			break;

		case "Add to Inventory" :
			updateInventory();
			break;

		case "Add New Product" :
			addNewProduct();
			break;
		case "Exit" :
			connection.end();
			break;

	}

});


